<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use App\Models\Indicator;

class Activity extends Model
{
    protected $fillable = [
        'project_id','name','description','start_date','end_date','target_value','unit'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function indicators()
    {
        return $this->hasMany(Indicator::class);
    }


}
