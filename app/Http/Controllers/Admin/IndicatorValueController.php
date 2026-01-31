<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Indicator;
use App\Models\IndicatorValue;
use App\Services\IndicatorAnalyticsService;


class IndicatorValueController extends Controller
{
    /* ---------------- INDEX (already OK) ---------------- */

    public function index(Indicator $indicator)
{
    // Load hierarchy for breadcrumbs
    $indicator->load('activity.project');

    // Indicator values (table + charts)
    $values = $indicator->values()
        ->with('collectedBy')
        ->orderBy('reporting_date')
        ->get();

    // 🔥 STEP 17A — Time-series analytics (for line / trend charts)
    $timeSeries = $values->map(fn ($v) => [
        'date' => $v->reporting_date,
        'value' => $v->value,
    ]);

    // 🔥 STEP 16 — KPI + Analytics
    $baseline = $indicator->baseline_value ?? 0;
    $target = $indicator->target_value ?? 0;
    $current = $values->sum('value');

    $progress = $target > 0
        ? round(($current / $target) * 100, 2)
        : 0;

    $gap = max($target - $current, 0);

    return inertia('IndicatorValues/Index', [
        // 🔥 Structured analytics object (UI-ready)
        'indicator' => [
            'id' => $indicator->id,
            'name' => $indicator->name,
            'unit' => $indicator->unit,
            'direction' => $indicator->direction ?? 'increase',

            // analytics
            'baseline' => $baseline,
            'current' => $current,
            'target' => $target,
            'progress' => $progress,
            'gap' => $gap,

            // relationships for breadcrumbs
            'activity' => $indicator->activity,
        ],

        'values' => $values,         // table
        'timeSeries' => $timeSeries, // charts

        'stats' => [
            'baseline' => $baseline,
            'target' => $target,
            'collected' => $current,
            'achievement' => $progress,
        ],
    ]);
}



    /* ---------------- STORE (already OK) ---------------- */

    public function store(Request $request, Indicator $indicator)
    {
        $data = $request->validate([
            'reporting_date' => 'required|date',
            'value' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $indicator->values()->create([
            ...$data,
            'submitted_by' => auth()->id(),
        ]);

        return back()->with('success', 'Value submitted');
    }

    /* ---------------- UPDATE ---------------- */

    public function update(Request $request, IndicatorValue $indicatorValue)
    {
        $data = $request->validate([
            'reporting_date' => 'required|date',
            'value' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $indicatorValue->update($data);

        return back()->with('success', 'Value updated');
    }

    /* ---------------- DELETE ---------------- */

    public function destroy(IndicatorValue $indicatorValue)
    {
        $indicatorValue->delete();

        return back()->with('success', 'Value deleted');
    }
}