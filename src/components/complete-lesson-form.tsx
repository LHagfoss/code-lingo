"use client";

import { useActionState } from "react";
import { completeLessonAction } from "@/actions/user/progress";

const initialState = {
    message: "",
    success: false,
};

export function CompleteLessonForm({
    lessonId,
    isCompleted,
}: {
    lessonId: number;
    isCompleted: boolean;
}) {
    const completeLessonWithId = completeLessonAction.bind(null, lessonId);

    const [state, formAction, isPending] = useActionState(
        completeLessonWithId,
        initialState,
    );

    return (
        <form action={formAction}>
            <button
                type="submit"
                disabled={isCompleted || isPending}
                className={`px-3 py-1 text-sm rounded font-bold transition-colors ${
                    isCompleted
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
                {isCompleted ? "✅ DONE" : isPending ? "..." : "START"}
            </button>
        </form>
    );
}
