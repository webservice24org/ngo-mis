<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\IndicatorController;
use App\Http\Controllers\Admin\IndicatorValueController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\ProjectBeneficiaryController;
use App\Http\Controllers\Admin\FormController;
use App\Http\Controllers\Admin\FormSubmissionController;


/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


/*
|--------------------------------------------------------------------------
| AUTH + VERIFIED
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


/*
|--------------------------------------------------------------------------
| AUTHENTICATED USERS
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | ADMIN PANEL
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin')
        ->name('admin.')
        ->middleware('role:Admin')
        ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');


        /*
        |--------------------------------------------------------------------------
        | PROJECTS
        |--------------------------------------------------------------------------
        */
        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');


        /*
        |--------------------------------------------------------------------------
        | PROJECT → ACTIVITIES
        |--------------------------------------------------------------------------
        */
        Route::get('projects/{project}/activities',
            [ActivityController::class, 'index']
        )->name('projects.activities.index');

        Route::post('projects/{project}/activities',
            [ActivityController::class, 'store']
        )->name('projects.activities.store');

        Route::get('activities/{activity}',
            [ActivityController::class, 'show']
        )->name('activities.show');

        Route::put('activities/{activity}',
            [ActivityController::class, 'update']
        )->name('activities.update');

        Route::delete('activities/{activity}',
            [ActivityController::class, 'destroy']
        )->name('activities.destroy');


        /*
        |--------------------------------------------------------------------------
        | ACTIVITY → INDICATORS
        |--------------------------------------------------------------------------
        */
        Route::get('activities/{activity}/indicators',
            [IndicatorController::class, 'index']
        )->name('activities.indicators.index');

        Route::post('activities/{activity}/indicators',
            [IndicatorController::class, 'store']
        )->name('activities.indicators.store');

        Route::put('indicators/{indicator}',
            [IndicatorController::class, 'update']
        )->name('indicators.update');

        Route::delete('indicators/{indicator}',
            [IndicatorController::class, 'destroy']
        )->name('indicators.destroy');


        /*
        |--------------------------------------------------------------------------
        | INDICATOR → VALUES
        |--------------------------------------------------------------------------
        */
        Route::get('indicators/{indicator}/values',
            [IndicatorValueController::class, 'index']
        )->name('indicators.values.index');

        Route::post('indicators/{indicator}/values',
            [IndicatorValueController::class, 'store']
        )->name('indicators.values.store');

        Route::put('indicator-values/{indicatorValue}',
            [IndicatorValueController::class, 'update']
        )->name('indicator-values.update');

        Route::delete('indicator-values/{indicatorValue}',
            [IndicatorValueController::class, 'destroy']
        )->name('indicator-values.destroy');


        /*
        |--------------------------------------------------------------------------
        | LOCATIONS
        |--------------------------------------------------------------------------
        */
        Route::get('locations',
            [LocationController::class, 'index']
        )->name('locations.index');

        Route::post('locations',
            [LocationController::class, 'store']
        )->name('locations.store');


        /*
        |--------------------------------------------------------------------------
        | PROJECT → BENEFICIARIES
        |--------------------------------------------------------------------------
        */
        Route::prefix('projects/{project}')
            ->name('projects.')
            ->group(function () {

            Route::get('beneficiaries',
                [ProjectBeneficiaryController::class, 'index']
            )->name('beneficiaries.index');

            Route::post('beneficiaries',
                [ProjectBeneficiaryController::class, 'store']
            )->name('beneficiaries.store');

            Route::put('beneficiaries/{beneficiary}',
                [ProjectBeneficiaryController::class, 'update']
            )->name('beneficiaries.update');


            /*
            |--------------------------------------------------------------------------
            | FORMS
            |--------------------------------------------------------------------------
            */
            Route::prefix('forms')
                ->name('forms.')
                ->group(function () {

                Route::get('/', [FormController::class, 'index'])
                    ->name('index');

                Route::get('/create', [FormController::class, 'create'])
                    ->name('create');

                Route::post('/', [FormController::class, 'store'])
                    ->name('store');

                Route::get('/{form}/builder', [FormController::class, 'builder'])
                    ->name('builder');

                Route::post('/{form}/fields', [FormController::class, 'storeField'])
                    ->name('fields.store');

                Route::put('/{form}/fields/{field}',
                        [FormController::class, 'updateField']
                    )->name('fields.update');

                    Route::post('{form}/fields/{field}/duplicate',
                        [FormController::class, 'duplicateField']
                    )->name('fields.duplicate');


                Route::delete('/{form}/fields/{field}', [FormController::class, 'destroyField'])
                    ->name('fields.destroy');

                    Route::post('{form}/fields/reorder',
                        [FormController::class, 'reorderFields']
                    )->name('fields.reorder');

                /*
                |--------------------------------------------------------------------------
                | ADMIN → FORM SUBMISSIONS
                |--------------------------------------------------------------------------
                */
                Route::get('/{form}/submissions',
                    [FormSubmissionController::class, 'index']
                )->name('submissions.index');

                Route::get('/{form}/submissions/{submission}/edit',
                    [FormSubmissionController::class, 'edit']
                )->name('submissions.edit');

                Route::put('/{form}/submissions/{submission}',
                    [FormSubmissionController::class, 'update']
                )->name('submissions.update');

            });

        });

    });


    /*
    |--------------------------------------------------------------------------
    | FIELD DATA COLLECTION (Authenticated Non-Admin Users)
    |--------------------------------------------------------------------------
    */

    Route::prefix('forms')
        ->name('forms.')
        ->group(function () {

        Route::get('/{form}/fill',
            [FormSubmissionController::class, 'create']
        )->name('fill');

        Route::post('/{form}/submit',
            [FormSubmissionController::class, 'store']
        )->name('submit');

    });


    /*
    |--------------------------------------------------------------------------
    | ROLE PLACEHOLDERS
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:M&E Officer')->group(function () {
        // Future M&E routes
    });

    Route::middleware('role:Enumerator')->group(function () {
        // Future Enumerator routes
    });

});


require __DIR__.'/settings.php';
