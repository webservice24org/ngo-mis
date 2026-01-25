<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Project;

return new class extends Migration
{
    public function up(): void
    {
        // Add user_id column
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('code');
        });

        // Migrate data from donor_name to user_id
        $donorUsers = User::role('Donor')->get(); // all users with Donor role

        Project::all()->each(function ($project) use ($donorUsers) {
            $donor = $donorUsers->firstWhere('name', $project->donor_name);
            if ($donor) {
                $project->user_id = $donor->id;
                $project->save();
            }
        });

        // Remove old donor_name column
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('donor_name');
        });

        // Add foreign key constraint
        Schema::table('projects', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('donor_name')->after('code')->nullable();
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
