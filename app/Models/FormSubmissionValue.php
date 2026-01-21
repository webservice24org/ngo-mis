<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmissionValue extends Model
{
    protected $fillable = [
        'submission_id','field_name','value'
    ];

    
}
