"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUnitAction } from "@/actions/admin/units";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";

type FormState = {
    message: string;
    errors?: {
        title?: string[];
        description?: string[];
        order?: string[];
    };
    success: boolean;
};

const initialState: FormState = {
    message: "",
    errors: {},
    success: false,
};

export function AddUnitForm({
    courseId,
    nextOrder,
}: {
    courseId: string;
    nextOrder: number;
}) {
    const [state, formAction, isPending] = useActionState<FormState, FormData>(
        createUnitAction.bind(null, courseId),
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
                Add New Unit
            </h3>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Unit Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="e.g. Unit 1: Basics"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                    />
                    {state?.errors?.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="e.g. Learn the fundamentals..."
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                    />
                    {state?.errors?.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.description}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="order"
                        className="block text-sm font-bold text-slate-700 mb-1"
                    >
                        Order
                    </label>
                    <input
                        type="number"
                        id="order"
                        name="order"
                        defaultValue={nextOrder}
                        placeholder="e.g. 1"
                        className="w-full border-2 border-b-4 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition font-bold text-slate-700"
                    />
                    {state?.errors?.order && (
                        <p className="text-red-500 text-sm mt-1">
                            {state.errors.order}
                        </p>
                    )}
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
                    {isPending ? "Adding..." : "Add Unit"}
                </AppButton>
            </form>
        </Card>
    );
}
