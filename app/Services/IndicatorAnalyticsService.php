<?php

namespace App\Services;

use App\Models\Indicator;
use Carbon\Carbon;

class IndicatorAnalyticsService
{
    public static function calculate(Indicator $indicator): array
    {
        $baseline = $indicator->baseline_value ?? 0;
        $target = $indicator->target_value ?? 0;
        $current = $indicator->values->sum('value');

        if ($target == 0 || $baseline == $target) {
            return [
                'baseline' => $baseline,
                'current' => $current,
                'target' => $target,
                'progress' => 0,
                'gap' => 0,
            ];
        }

        if ($indicator->direction === 'increase') {
            $progress = (($current - $baseline) / ($target - $baseline)) * 100;
            $gap = max($target - $current, 0);
        } else {
            $progress = (($baseline - $current) / ($baseline - $target)) * 100;
            $gap = max($current - $target, 0);
        }

        return [
            'baseline' => $baseline,
            'current' => $current,
            'target' => $target,
            'progress' => round(max(min($progress, 100), 0), 1),
            'gap' => round($gap, 2),
        ];
    }

    

    public static function timeSeries(Indicator $indicator, string $period = 'monthly')
    {
        $values = $indicator->values()->orderBy('reporting_date')->get();

        return $values
            ->groupBy(function ($row) use ($period) {
                return $period === 'quarterly'
                    ? Carbon::parse($row->reporting_date)->format('Y-\QQ')
                    : Carbon::parse($row->reporting_date)->format('Y-m');
            })
            ->map(function ($group, $label) {
                return [
                    'label' => $label,
                    'value' => $group->sum('value'),
                ];
            })
            ->values();
    }


}
