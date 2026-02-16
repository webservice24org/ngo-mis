<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $rangamati = Location::create([
            'name' => 'Rangamati',
            'type' => 'district',
        ]);

        $bandarban = Location::create([
            'name' => 'Bandarban',
            'type' => 'district',
        ]);

        $khagrachari = Location::create([
            'name' => 'Khagrachari',
            'type' => 'district',
        ]);

        // Upazilas (example)
        $rangamatiSadar = Location::create([
            'name' => 'Rangamati Sadar',
            'type' => 'upazila',
            'parent_id' => $rangamati->id,
        ]);

        Location::create([
            'name' => 'Subalong',
            'type' => 'union',
            'parent_id' => $rangamatiSadar->id,
        ]);
    }
}
