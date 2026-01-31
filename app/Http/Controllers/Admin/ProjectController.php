<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use App\Services\IndicatorAnalyticsService;

class ProjectController extends Controller
{
    public function index()
    {
        return inertia('Projects/Index', [
            'projects' => Project::with(['donor', 'users'])->get()->map(function ($project) {
                return [
                    ...$project->toArray(),

                    // normalize relations for frontend
                    'manager' => $project->users
                        ->where('pivot.role', 'manager')
                        ->values(),

                    'team' => $project->users
                        ->where('pivot.role', 'team')
                        ->values(),
                ];
            }),

            'donors' => User::role('Donor')->get(),
            'managers' => User::role('Project Manager')->get(),
            'enumerators' => User::role('Enumerator')->get(),
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'code' => 'required|unique:projects',
            'user_id' => 'required|exists:users,id', // donor
            'manager_id' => 'required|exists:users,id',
            'team_ids' => 'array',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $project = Project::create([
            'name' => $data['name'],
            'code' => $data['code'],
            'user_id' => $data['user_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'status' => $data['status'],
            'description' => $data['description'],
            'created_by' => auth()->id(),
        ]);


        // assign manager
        $project->users()->attach($data['manager_id'], ['role' => 'manager']);

        // assign team
        if (!empty($data['team_ids'])) {
            foreach ($data['team_ids'] as $userId) {
                $project->users()->attach($userId, ['role' => 'team']);
            }
        }

        return back()->with('success', 'Project created successfully');
    }

    public function update(Request $request, Project $project)
    {
        $project->update(
            $request->only(
                'name',
                'code',
                'user_id',
                'start_date',
                'end_date',
                'status',
                'description'
            )
        );

        $project->users()->detach();

        $project->users()->attach($request->manager_id, ['role' => 'manager']);

        foreach ($request->team_ids ?? [] as $userId) {
            $project->users()->attach($userId, ['role' => 'team']);
        }

        return back()->with('success', 'Project updated');
    }


    public function show(Project $project)
    {
        $project->load([
            'activities.indicators.values'
        ]);

        $activities = $project->activities->map(function ($activity) {

            $indicators = $activity->indicators->map(function ($indicator) {
                $collected = $indicator->values->sum('value');
                $target = $indicator->target_value ?? 0;

                $achievement = $target > 0
                    ? round(($collected / $target) * 100, 1)
                    : 0;

                return [
                    'id' => $indicator->id,
                    'name' => $indicator->name,
                    'achievement' => $achievement,
                    'target' => $target,
                    'collected' => $collected,
                    'values' => $indicator->values->map(fn ($v) => [
                        'date' => $v->reporting_date,
                        'value' => $v->value,
                    ]),
                ];
            });

            $avgAchievement = $indicators->avg('achievement') ?? 0;

            return [
                'id' => $activity->id,
                'name' => $activity->name,
                'avg_achievement' => round($avgAchievement, 1),
                'indicators' => $indicators,
            ];
        });

        /* ---------- Project KPIs ---------- */
        $allIndicators = $activities->flatMap(fn ($a) => $a['indicators']);

        $projectAchievement = $allIndicators->avg('achievement') ?? 0;

        return inertia('Projects/Show', [
            'project' => $project,
            'activities' => $activities,
            'stats' => [
                'activities' => $project->activities->count(),
                'indicators' => $allIndicators->count(),
                'avg_achievement' => round($projectAchievement, 1),
                'on_track' => $allIndicators->where('achievement', '>=', 80)->count(),
                'off_track' => $allIndicators->where('achievement', '<', 80)->count(),
            ],
        ]);

        

        $activity->load(['indicators.values']);

        $indicators = $activity->indicators->map(function ($indicator) {
            return [
                'id' => $indicator->id,
                'name' => $indicator->name,
                'unit' => $indicator->unit,
                'direction' => $indicator->direction,
                ...IndicatorAnalyticsService::calculate($indicator),
            ];
        });

    }


    public function destroy(Project $project)
    {
        $project->delete();
        return back()->with('success', 'Project deleted');
    }
}

