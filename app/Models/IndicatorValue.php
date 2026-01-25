<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorValue extends Model
{
    protected $fillable = [
        'indicator_id',
        'reporting_date',
        'value',
        'submitted_by',
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}

