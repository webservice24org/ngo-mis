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

        return redirect()
        ->route('admin.projects.forms.index', $project)
        ->with('success', 'Form created successfully.');
    }

    public function builder(Project $project, Form $form)
    {
        $form->load([
            'fields' => fn ($q) => $q->orderBy('order')
        ]);

        return Inertia::render('Forms/Builder', [
            'project' => $project,
            'form' => $form
        ]);
    }

    public function reorderFields(Request $request, Project $project, Form $form)
    {
        foreach ($request->fields as $index => $id) {
            $form->fields()
                ->where('id', $id)
                ->update(['order' => $index]);
        }

        return back()->with('success', 'Fields reordered successfully.');
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

        return back()->with('success', 'Field added successfully.');
    }

        public function updateField(
        Request $request,
        Project $project,
        Form $form,
        FormField $field
        ) {
        $data = $request->validate([
            'label' => 'required|string',
            'field_type' => 'required|string',
            'is_required' => 'boolean',
            'options' => 'nullable|array',
            'conditional_field_id' => 'nullable|integer',
            'conditional_value' => 'nullable|string',
        ]);

        $field->update($data);

        return back()->with('success', 'Field updated successfully.');
    }

    public function duplicateField(
        Project $project,
        Form $form,
        FormField $field
    ) {
        $new = $field->replicate();
        $new->label = $field->label . ' (Copy)';
        $new->order = $form->fields()->max('order') + 1;
        $new->save();

        return back()->with('success', 'Field duplicated successfully.');
    }


    public function destroyField(Project $project, Form $form, FormField $field)
    {
        $field->delete();

        return back();
    }



}
