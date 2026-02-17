<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Form;
use App\Models\FormSubmission;
use Inertia\Inertia;

class FormSubmissionController extends Controller
{

    public function index(Form $form)
    {
        $form->load([
            'fields',
            'submissions.values.field'
        ]);

        return Inertia::render('Forms/Submissions', [
            'form' => $form,
        ]);
    }


    public function create(Form $form)
    {
        $form->load('fields');

        return Inertia::render('Forms/Fill', [
            'form' => $form
        ]);
    }


    public function store(Request $request, Form $form)
    {
        $form->load('fields');

        $submission = FormSubmission::create([
            'form_id' => $form->id,
            'submitted_by' => auth()->id(),
            'beneficiary_id' => $request->beneficiary_id,
            'submitted_at' => now(),
        ]);

        foreach ($form->fields as $field) {

            $value = $request->input($field->field_name);

            // File upload
            if ($field->field_type === 'file' && $request->hasFile($field->field_name)) {
                $value = $request->file($field->field_name)
                    ->store('form_uploads', 'public');
            }

            // Checkbox array
            if (is_array($value)) {
                $value = json_encode($value);
            }

            FormSubmissionValue::create([
                'submission_id' => $submission->id,
                'field_name' => $field->field_name,
                'value' => $value,
            ]);
        }

        return redirect()->back()->with('success', 'Form submitted successfully');
    }

    public function edit(Form $form, FormSubmission $submission)
    {
        $form->load('fields');

        $submission->load('values');

        // Convert values to key-value array
        $answers = $submission->values
            ->pluck('value', 'field_name');

        return Inertia::render('Forms/EditSubmission', [
            'form' => $form,
            'submission' => $submission,
            'answers' => $answers,
        ]);
    }


    public function update(Request $request, Form $form, FormSubmission $submission)
    {
        $form->load('fields');

        foreach ($form->fields as $field) {

            $value = $request->input($field->field_name);

            // Handle file
            if ($field->field_type === 'file' && $request->hasFile($field->field_name)) {
                $value = $request->file($field->field_name)
                    ->store('form_uploads', 'public');
            }

            if (is_array($value)) {
                $value = json_encode($value);
            }

            FormSubmissionValue::updateOrCreate(
                [
                    'submission_id' => $submission->id,
                    'field_name' => $field->field_name,
                ],
                [
                    'value' => $value,
                ]
            );
        }

        $submission->update([
            'submitted_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Submission updated');
    }



}
