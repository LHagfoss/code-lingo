"use client";

import Image from "next/image";
import { Activity, useActionState, useState } from "react";
import { updateCourseAction } from "@/actions/admin/courses";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";

type Props = {
    course: {
        id: string;
        title: string;
        image_src: string;
    };
};

const initialState = {
    message: "",
    success: false,
};

export function EditCourseForm({ course }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const updateActionWithId = updateCourseAction.bind(null, course.id);
    const [state, formAction, isPending] = useActionState(
        updateActionWithId,
        initialState,
    );

    return (
        <>
            <Activity mode={!isEditing ? "visible" : "hidden"}>
                <div className="flex items-center gap-6 pb-6">
                    <div className="relative w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200">
                        {course.image_src ? (
                            <Image
                                src={course.image_src}
                                alt={course.title}
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        ) : (
                            <span className="text-2xl">📚</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-700">
                            {course.title}
                        </h1>
                        <p className="text-slate-500 font-bold">
                            Course Manager
                        </p>
                    </div>
                    <div className="ml-auto flex gap-3">
                        <AppButton
                            onClick={() => setIsEditing(true)}
                            variant="primary"
                        >
                            Edit Details
                        </AppButton>
                        <AppButton href="/admin/courses" variant="secondary">
                            ← Back to Courses
                        </AppButton>
                    </div>
                </div>
            </Activity>

            <Activity mode={isEditing ? "visible" : "hidden"}>
                <Card className="p-6 mb-8 border-2 border-blue-200 bg-blue-50/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-700">
                            Edit Course Details
                        </h3>
                        <AppButton
                            onClick={() => setIsEditing(false)}
                            variant="ghost"
                        >
                            Cancel
                        </AppButton>
                    </div>

                    <form
                        action={(formData) => {
                            formAction(formData);
                        }}
                        className="space-y-6"
                    >
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
                                defaultValue={course.title}
                                placeholder="e.g. French"
                                className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="image_src"
                                className="block text-sm font-bold text-slate-700 mb-2"
                            >
                                Image URL
                            </label>
                            <input
                                type="text"
                                id="image_src"
                                name="image_src"
                                defaultValue={course.image_src}
                                placeholder="e.g. /courses/french.png"
                                className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Preview:
                                {course.image_src && (
                                    <img
                                        src={course.image_src}
                                        alt="Preview"
                                        className="w-8 h-8 inline-block ml-2 rounded border"
                                    />
                                )}
                            </p>
                        </div>

                        {state?.message && (
                            <div
                                className={`p-4 rounded-xl font-bold border-2 ${state.success ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}
                            >
                                {state.message}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <AppButton
                                onClick={() => setIsEditing(false)}
                                type="button"
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
                                {isPending ? "Saving..." : "Save Changes"}
                            </AppButton>
                        </div>
                    </form>
                </Card>
            </Activity>
        </>
    );
}
