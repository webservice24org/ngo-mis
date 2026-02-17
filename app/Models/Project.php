<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;
use App\Models\Beneficiary;
use App\Models\Form;
use App\Models\User;

class Project extends Model
{
    protected $fillable = [
        'name',
        'code',
        'user_id',
        'start_date',
        'end_date',
        'status',
        'description',
        'created_by',
    ];

    public function donor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function manager()
    {
        return $this->users()->wherePivot('role', 'manager');
    }

    public function team()
    {
        return $this->users()->wherePivot('role', 'team');
    }


    public function activities()
    {
        return $this->hasMany(Activity::class);
    }


    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }

    public function locations()
    {
        return $this->belongsToMany(
            Location::class,
            'project_location' // 👈 explicit pivot table name
        );
    }





    public function forms()
    {
        return $this->hasMany(Form::class);
    }
}


