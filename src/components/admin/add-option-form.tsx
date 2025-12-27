"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createOptionAction } from "@/actions/admin/options";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type FormState = {
    message: string;
    errors?: {
        text?: string[];
        correct?: string[];
    };
    success: boolean;
};

const initialState: FormState = {
    message: "",
    errors: {},
    success: false,
};

export function AddOptionForm({ exerciseId }: { exerciseId: string }) {
    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        createOptionAction.bind(null, exerciseId),
        initialState,
    );
    const [isCorrect, setIsCorrect] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success && formRef.current) {
            formRef.current.reset();
            setIsCorrect(false);
        }
    }, [state?.success]);

    return (
        <Card className="p-6 bg-slate-50 border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-4">
                Add New Answer Option
            </h3>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div>
                    <label
                        htmlFor="text"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Option Text
                    </label>
                    <input
                        type="text"
                        id="text"
                        name="text"
                        placeholder="e.g. print()"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                    />
                    {state?.errors?.text && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.text}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        type="hidden"
                        name="correct"
                        value={isCorrect ? "on" : ""}
                    />
                    <Checkbox
                        label="This is the correct answer"
                        checked={isCorrect}
                        onCheckedChange={setIsCorrect}
                    />
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
                    {isPending ? "Adding..." : "Add Option"}
                </AppButton>
            </form>
        </Card>
    );
}
