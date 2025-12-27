"use client";

import { useActionState, useEffect, useRef } from "react";
import { createExerciseAction } from "@/actions/admin/exercises";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";

type FormState = {
    message: string;
    errors?: {
        question?: string[];
    };
    success: boolean;
};

const initialState: FormState = {
    message: "",
    errors: {},
    success: false,
};

export function AddExerciseForm({ lessonId }: { lessonId: string }) {
    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        createExerciseAction.bind(null, lessonId),
        initialState,
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success && formRef.current) {
            formRef.current.reset();
        }
    }, [state?.success]);

    return (
        <Card className="p-6 bg-slate-50 border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-4">
                Add New Exercise
            </h3>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div>
                    <label
                        htmlFor="question"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Question
                    </label>
                    <textarea
                        id="question"
                        name="question"
                        placeholder="e.g. Which keyword declares a constant?"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition resize-none h-24 font-bold text-slate-700"
                    />
                    {state?.errors?.question && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.question}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="type"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Exercise Type
                    </label>
                    <div className="relative">
                        <select
                            id="type"
                            name="type"
                            className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700 appearance-none bg-white"
                        >
                            <option value="SELECT">
                                Multiple Choice (Select One)
                            </option>
                            <option value="ASSIST">
                                Assist (Fill in blank / easier)
                            </option>
                            <option value="CODE_ARRANGE">
                                Code Arrange (Drag & Drop)
                            </option>
                            <option value="INFO">
                                Informational (Read only)
                            </option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            ▼
                        </div>
                    </div>
                </div>

                {state?.message && (
                    <div
                        className={`p-3 rounded-lg text-sm font-bold ${state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                        {state.message}
                    </div>
                )}

                <AppButton
                    type="submit"
                    variant="primary"
                    disabled={isPending}
                    fullWidth
                >
                    {isPending ? "Adding..." : "Add Exercise"}
                </AppButton>
            </form>
        </Card>
    );
}
