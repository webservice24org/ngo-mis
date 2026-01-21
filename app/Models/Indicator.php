<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;

class Indicator extends Model
{
    protected $fillable = [
        'activity_id','name','indicator_type','baseline_value','target_value','unit'
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
