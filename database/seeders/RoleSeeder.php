<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'manage users',
            'manage projects',
            'manage activities',
            'manage indicators',
            'manage forms',
            'submit data',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $me = Role::firstOrCreate(['name' => 'M&E Officer']);
        $enumerator = Role::firstOrCreate(['name' => 'Enumerator']);
        $donor = Role::firstOrCreate(['name' => 'Donor']);

        $admin->givePermissionTo(Permission::all());

        $me->givePermissionTo([
            'manage projects',
            'manage activities',
            'manage indicators',
            'manage forms',
            'view reports',
        ]);

        $enumerator->givePermissionTo([
            'submit data',
        ]);

        $donor->givePermissionTo([
            'view reports',
        ]);
    }
}
