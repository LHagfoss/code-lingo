"use client";

import { useActionState } from "react";
import { createCourseAction } from "@/actions/admin/courses";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";

const initialState = {
    message: "",
};

export function CreateCourseForm() {
    const [state, formAction, isPending] = useActionState(
        createCourseAction,
        initialState,
    );

    return (
        <Card className="max-w-xl mx-auto p-8">
            <form action={formAction} className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-bold text-slate-700 mb-2"
                    >
                        Course Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="e.g. French"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                    />
                </div>

                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-bold text-slate-700 mb-2"
                    >
                        Course Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700 bg-white"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        Upload a PNG or JPG image.
                    </p>
                </div>

                {state?.message && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-600 font-bold border-2 border-red-100">
                        {state.message}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <AppButton
                        href="/admin/courses"
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancel
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Course"}
                    </AppButton>
                </div>
            </form>
        </Card>
    );
}
