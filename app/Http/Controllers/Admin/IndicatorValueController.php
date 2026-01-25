<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Indicator;
use App\Models\IndicatorValue;


class IndicatorValueController extends Controller
{
    public function index(Indicator $indicator)
    {
        $values = $indicator->values()->latest()->get();

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

    public function store(Request $request, Indicator $indicator)
    {
        $data = $request->validate([
            'reporting_date' => 'required|date',
            'value' => 'required|integer|min:0',
        ]);

        $indicator->values()->create([
            ...$data,
            'submitted_by' => auth()->id(),
        ]);

        return back()->with('success', 'Value submitted');
    }
}

