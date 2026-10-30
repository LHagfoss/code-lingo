"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { completeOnboardingAction } from "@/actions/onboarding";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";

type Course = {
    id: string;
    title: string;
    image_src: string | null;
};

type OnboardingFormProps = {
    courses: Course[];
    defaultUsername?: string;
};

const initialState = {
    message: "",
    errors: {},
};

export function OnboardingForm({
    courses,
    defaultUsername,
}: OnboardingFormProps) {
    const [state, formAction, isPending] = useActionState(
        completeOnboardingAction,
        initialState,
    );
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    return (
        <form action={formAction} className="space-y-8 w-full max-w-lg">
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Pick a Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        defaultValue={defaultUsername || ""}
                        placeholder="e.g. CodeMaster99"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-gray-700"
                    />
                    {state?.errors?.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.username}
                        </p>
                    )}
                </div>

                <fieldset className="space-y-2">
                    <legend className="block text-sm font-bold text-gray-700 mb-2">
                        Choose a Course
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <label
                                key={course.id}
                                className="cursor-pointer transition-all"
                            >
                                <input
                                    type="radio"
                                    name="courseId"
                                    value={course.id}
                                    checked={selectedCourse === course.id}
                                    onChange={() =>
                                        setSelectedCourse(course.id)
                                    }
                                    className="peer sr-only"
                                />
                                <Card
                                    className={`flex flex-col items-center p-4 gap-3 h-full peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 ${
                                        selectedCourse === course.id
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <Image
                                        src={
                                            course.image_src ||
                                            "/courses/python.png"
                                        }
                                        alt=""
                                        width={64}
                                        height={64}
                                        className="object-contain"
                                    />
                                    <span className="font-bold text-gray-800">
                                        {course.title}
                                    </span>
                                </Card>
                            </label>
                        ))}
                    </div>
                    {state?.errors?.courseId && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.courseId}
                        </p>
                    )}
                </fieldset>
            </div>

            {state?.message && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 font-bold border-2 border-red-100">
                    {state.message}
                </div>
            )}

            <AppButton
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={isPending}
            >
                {isPending ? "Setting up..." : "Continue Learning"}
            </AppButton>
        </form>
    );
}
