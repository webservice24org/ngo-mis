<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Project;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;



// app/Models/Location.php
class Location extends Model
{
    
    protected $fillable = ['name', 'type', 'parent_id'];

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }
    
    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'project_location' // 👈 same here
        );
    }

    public function descendants()
{
    return $this->hasMany(Location::class, 'parent_id')
        ->with('descendants');
}





}

