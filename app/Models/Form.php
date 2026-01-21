<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\FormField;
use App\Models\FormSubmission;

class Form extends Model
{
    protected $fillable = [
        'project_id','activity_id','name','description','is_active'
    ];

    public function fields()
    {
        return $this->hasMany(FormField::class);
    }

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }
}
