<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Activity;

class IndicatorController extends Controller
{
    /**
     * Display indicators for a specific activity
     */
    public function index(Activity $activity)
{
    return inertia('Indicators/Index', [
        'activity' => $activity,
        'indicators' => $activity->indicators()->latest()->get(),

        // KPI summary
        'kpis' => [
            'total' => $activity->indicators()->count(),
            'output' => $activity->indicators()->where('indicator_type', 'output')->count(),
            'outcome' => $activity->indicators()->where('indicator_type', 'outcome')->count(),
            'target_sum' => $activity->indicators()->sum('target_value'),
            'baseline_sum' => $activity->indicators()->sum('baseline_value'),
        ],
    ]);
}


    /**
     * Store a new indicator
     */
    public function store(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'indicator_type' => 'required|in:output,outcome',
            'target_value' => 'nullable|numeric',
            'baseline_value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:100',
        ]);

        $activity->indicators()->create($data);

        return back()->with('success', 'Indicator created successfully');
    }

    /**
     * Update an existing indicator
     */
    public function update(Request $request, Indicator $indicator)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'indicator_type' => 'required|in:output,outcome',
            'target_value' => 'nullable|numeric',
            'baseline_value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:100',
        ]);

        $indicator->update($data);

        return back()->with('success', 'Indicator updated successfully');
    }

    /**
     * Delete an indicator
     */
    public function destroy(Indicator $indicator)
    {
        $indicator->delete();

        return back()->with('success', 'Indicator deleted successfully');
    }

}
