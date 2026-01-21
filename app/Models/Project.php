<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activity;
use App\Models\Beneficiary;
use App\Models\Form;

class Project extends Model
{
    protected $fillable = [
        'name','code','donor_name','start_date','end_date','status','description','created_by'
    ];

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }

    public function forms()
    {
        return $this->hasMany(Form::class);
    }
}

