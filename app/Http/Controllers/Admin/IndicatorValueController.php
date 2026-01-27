<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Indicator;
use App\Models\IndicatorValue;


class IndicatorValueController extends Controller
{
    /* ---------------- INDEX (already OK) ---------------- */

    public function index(Indicator $indicator)
    {
        $indicator->load('activity.project');

        $values = $indicator->values()
            ->with('collectedBy')
            ->latest()
            ->get();

        $values = $indicator->values()
            ->orderBy('reporting_date')
            ->get()
            ->map(fn ($v) => [
                'date' => $v->reporting_date,
                'value' => $v->value,
            ]);


        $totalCollected = $values->sum('value');

        $achievement = $indicator->target_value
            ? round(($totalCollected / $indicator->target_value) * 100, 2)
            : 0;

        return inertia('IndicatorValues/Index', [
            'indicator' => $indicator,
            'values' => $values,
            'stats' => [
                'baseline' => $indicator->baseline_value,
                'target' => $indicator->target_value,
                'collected' => $totalCollected,
                'achievement' => $achievement,
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