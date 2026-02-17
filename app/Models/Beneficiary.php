<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\Location;
use Carbon\Carbon;

class Beneficiary extends Model
{
    protected $fillable = [
        'project_id',
        'unique_code',
        'gender',
        'date_of_birth',
        'location_id',
        'vulnerability_type',
        'phone',
        'national_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date:Y-m-d',
    ];


    protected $appends = ['calculated_age'];

    public function getCalculatedAgeAttribute()
    {
        return $this->date_of_birth
            ? Carbon::parse($this->date_of_birth)->age
            : null;
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}

