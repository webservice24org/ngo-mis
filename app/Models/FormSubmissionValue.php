<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmissionValue extends Model
{
    protected $fillable = [
        'submission_id','field_name','value'
    ];

    public function field()
    {
        return $this->belongsTo(FormField::class, 'form_field_id');
    }
}
