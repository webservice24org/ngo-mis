<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\FormSubmissionValue;

class FormSubmission extends Model
{
    protected $fillable = [
        'form_id','submitted_by','beneficiary_id','submitted_at'
    ];

    public function values()
    {
        return $this->hasMany(FormSubmissionValue::class, 'submission_id');
    }
}
