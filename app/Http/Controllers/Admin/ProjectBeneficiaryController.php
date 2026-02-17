<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Beneficiary;
use App\Models\Location;
use App\Models\Project;
use Carbon\Carbon;

class ProjectBeneficiaryController extends Controller
{
    public function index(Project $project, Request $request)
    {
        $query = Beneficiary::query()
            ->where('project_id', $project->id)
            ->with('location:id,name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('unique_code', 'like', '%' . $request->search . '%')
                ->orWhere('phone', 'like', '%' . $request->search . '%')
                ->orWhere('national_id', 'like', '%' . $request->search . '%');
            });
        }

        $stats = [
            'total' => (clone $query)->count(),
            'male' => (clone $query)->where('gender', 'male')->count(),
            'female' => (clone $query)->where('gender', 'female')->count(),
            'other' => (clone $query)->where('gender', 'other')->count(),
        ];

        $beneficiaries = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $locations = Location::with('childrenRecursive')
        ->whereNull('parent_id')
        ->get(['id','name','parent_id']);


        return inertia('Projects/Beneficiaries/Index', [
            'project' => $project->only('id', 'name'),
            'beneficiaries' => $beneficiaries,
            'stats' => $stats,
            'filters' => $request->only('search'),
            'locations' => $locations,
        ]);
    }



   public function store(Project $project, Request $request)
    {
        $validated = $request->validate([
            'unique_code' => 'required|unique:beneficiaries,unique_code',
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'location_id' => 'nullable|exists:locations,id',
            'vulnerability_type' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'national_id' => 'nullable|string|max:50',
        ]);

        $project->beneficiaries()->create($validated);

        return back()->with('success', 'Beneficiary created successfully');
    }


    public function update(Project $project, Beneficiary $beneficiary, Request $request)
    {
        $validated = $request->validate([
            'unique_code' => 'required|unique:beneficiaries,unique_code,' . $beneficiary->id,
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'location_id' => 'nullable|exists:locations,id',
            'vulnerability_type' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'national_id' => 'nullable|string|max:50',
        ]);

        $beneficiary->update($validated);

        return back()->with('success', 'Beneficiary updated successfully');
    }





}
