<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('project_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('location_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Core Identity
            $table->string('unique_code')->unique();

            // Demographics
            $table->enum('gender', ['male', 'female', 'other'])
                ->nullable()
                ->index();

            $table->date('date_of_birth')->nullable();
            $table->unsignedTinyInteger('age')->nullable()->index();

            // Vulnerability
            $table->string('vulnerability_type')->nullable()->index();

            // Optional extension fields (future-proof)
            $table->string('phone')->nullable()->index();
            $table->string('national_id')->nullable()->index();

            $table->timestamps();

            // Composite index for reporting performance
            $table->index(['project_id', 'location_id']);
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('beneficiaries');
        Schema::enableForeignKeyConstraints();
    }
};
