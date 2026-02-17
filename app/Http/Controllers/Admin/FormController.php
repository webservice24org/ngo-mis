<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Form;
use App\Models\FormField;
use App\Models\FormSubmission;
use Inertia\Inertia;

class FormController extends Controller
{
    public function index(Project $project)
    {
        return Inertia::render('Forms/Index', [
            'project' => $project,
            'forms' => $project->forms()->latest()->get(),
        ]);
    }

    public function create(Project $project)
    {
        return Inertia::render('Forms/Create', [
            'project' => $project
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $form = $project->forms()->create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('forms.builder', [$project, $form]);
    }

    public function builder(Project $project, Form $form)
    {
        return Inertia::render('Forms/Builder', [
            'project' => $project,
            'form' => $form->load('fields'),
        ]);
    }


    public function storeField(Request $request, Project $project, Form $form)
    {
        $request->validate([
            'label' => 'required',
            'field_name' => 'required',
            'field_type' => 'required',
        ]);

        $form->fields()->create([
            'label' => $request->label,
            'field_name' => $request->field_name,
            'field_type' => $request->field_type,
            'options' => $request->options,
            'is_required' => $request->is_required ?? false,
            'order' => $form->fields()->count() + 1,
        ]);

        return back();
    }

    public function destroyField(Project $project, Form $form, FormField $field)
    {
        $field->delete();

        return back();
    }



}
