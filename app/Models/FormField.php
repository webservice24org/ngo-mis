<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    protected $fillable = [
        'form_id',
        'label',
        'field_name',
        'field_type',
        'options',
        'is_required',
        'logic_rules',
        'order',
    ];
    
    protected $casts = [
        'options' => 'array',
        'logic_rules' => 'array',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }

}
