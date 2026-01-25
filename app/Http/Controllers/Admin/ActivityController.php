<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Activity;
use Inertia\Inertia;


class ActivityController extends Controller
{
    /**
     * Display activities for a project
     */
    public function index(Project $project)
    {
        return inertia('Activities/Index', [
            'project' => $project->only('id', 'name'),
            'activities' => $project->activities()->latest()->get(),
        ]);
    }


    public function store(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_value' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
        ]);

        $project->activities()->create($data);

        return back()->with('success', 'Activity created successfully');
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target_value' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
        ]);

        $activity->update($data);

        return back()->with('success', 'Activity updated successfully');
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return back()->with('success', 'Activity deleted');
    }
}

