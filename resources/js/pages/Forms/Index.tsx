
import AppLayout from "@/layouts/app-layout"
import { Link, Head } from "@inertiajs/react";

interface Form {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

interface Project {
    id: number;
    name: string;
}

interface Props {
    project: Project;
    forms: Form[];
}

export default function Index({ project, forms }: Props) {
    return (
        <AppLayout>
            <Head title={`Forms - ${project.name}`} />

            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Forms — {project.name}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage data collection forms for this project
                        </p>
                    </div>

                    <Link
                        href={route('admin.projects.forms.create', project.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        + Create Form
                    </Link>
                </div>

                {/* Forms Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {forms.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        No forms created yet.
                                    </td>
                                </tr>
                            )}

                            {forms.map((form) => (
                                <tr key={form.id}>
                                    <td className="px-6 py-4 font-medium">
                                        {form.name}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {form.description || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(form.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-4 text-right space-x-3">

                                        <Link
                                            href={route(
                                                'admin.projects.forms.builder',
                                                [project.id, form.id]
                                            )}
                                            className="text-indigo-600 hover:underline text-sm"
                                        >
                                            Builder
                                        </Link>

                                        <Link
                                            href={route(
                                                'admin.projects.forms.submissions.index',
                                                [project.id, form.id]
                                            )}
                                            className="text-green-600 hover:underline text-sm"
                                        >
                                            Submissions
                                        </Link>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </AppLayout>
    );
}
