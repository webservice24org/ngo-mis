<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;


class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::with('children.children')
            ->whereNull('parent_id')
            ->get();

        return inertia('Locations/Index', [
            'locations' => $locations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:country,district,upazila,union',
            'parent_id' => 'nullable|exists:locations,id',
        ]);

        // 🔐 ENFORCE HIERARCHY RULES
        if ($validated['parent_id']) {
            $parent = Location::findOrFail($validated['parent_id']);

            $valid = match ($validated['type']) {
                'district' => $parent->type === 'country',
                'upazila'  => $parent->type === 'district',
                'union'    => $parent->type === 'upazila',
                default    => false,
            };

            if (! $valid) {
                abort(422, 'Invalid parent location type.');
            }
        }

        // 🚫 Country must NOT have parent
        if ($validated['type'] === 'country') {
            $validated['parent_id'] = null;
        }

        Location::create($validated);

        return back()->with('success', 'Location created successfully.');
    }


}
