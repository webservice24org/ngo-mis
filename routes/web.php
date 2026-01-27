<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ActivityController;
use App\Http\Controllers\Admin\IndicatorController;
use App\Http\Controllers\Admin\IndicatorValueController;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {

    Route::middleware('role:Admin')->prefix('admin/')->name('admin.')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::get('projects/{project}',[ProjectController::class, 'show'])->name('projects.show');


        Route::get('projects/{project}/activities',[ActivityController::class, 'index'])->name('projects.activities.index');

        Route::post('projects/{project}/activities', [ActivityController::class, 'store'])->name('projects.activities.store');
        Route::put('activities/{activity}', [ActivityController::class, 'update'])->name('activities.update');
        Route::delete('activities/{activity}', [ActivityController::class, 'destroy'])->name('activities.destroy');
        Route::get('activities/{activity}',[ActivityController::class, 'show'])->name('activities.show');


        Route::get('activities/{activity}/indicators', [IndicatorController::class, 'index'])->name('activities.indicators.index');
        Route::post('activities/{activity}/indicators', [IndicatorController::class, 'store'])->name('activities.indicators.store');
        Route::put('indicators/{indicator}', [IndicatorController::class, 'update'])->name('indicators.update');
        Route::delete('indicators/{indicator}', [IndicatorController::class, 'destroy'])->name('indicators.destroy');

        Route::get('indicators/{indicator}/values',[IndicatorValueController::class, 'index'])->name('indicators.values.index');
        Route::post('indicators/{indicator}/values',[IndicatorValueController::class, 'store'])->name('indicators.values.store');
        Route::put('indicator-values/{indicatorValue}',[IndicatorValueController::class, 'update'])->name('indicator-values.update');
        Route::delete('indicator-values/{indicatorValue}',[IndicatorValueController::class, 'destroy'])->name('indicator-values.destroy');



    });

    Route::middleware('role:M&E Officer')->group(function () {
        // M&E routes
    });

    Route::middleware('role:Enumerator')->group(function () {
        // data collection routes
    });

});


require __DIR__.'/settings.php';
