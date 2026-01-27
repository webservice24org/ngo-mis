<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorValue extends Model
{
     protected $fillable = [
        'indicator_id',
        'value',
        'reporting_date',
        'submitted_by',
        'notes',
    ];

    public function collectedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    protected $casts = [
    'reporting_date' => 'date:Y-m-d',
];

}

