declare function route(name: string, params?: any): string
import AppLayout from "@/layouts/app-layout"
import { Head, useForm, Link } from "@inertiajs/react";

interface Project {
    id: number;
    name: string;
}

interface Props {
    project: Project;
}

export default function Create({ project }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("admin.projects.forms.store", project.id));
    };

    return (
        <AppLayout>
            <Head title={`Create Form - ${project.name}`} />

            <div className="p-6 max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">
                        Create New Form
                    </h1>
                    <p className="text-sm text-gray-500">
                        Project: {project.name}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white shadow rounded-lg p-6">

                    <form onSubmit={submit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Form Name *
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>

                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-indigo-200"
                                rows={4}
                            />

                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center">

                            <Link
                                href={route(
                                    "admin.projects.forms.index",
                                    project.id
                                )}
                                className="text-gray-600 hover:underline"
                            >
                                ← Back
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? "Creating..." : "Create Form"}
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
