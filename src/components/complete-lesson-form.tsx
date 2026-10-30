"use client";

import { useActionState } from "react";
import { completeLessonAction } from "@/actions/user/progress";

const initialState = {
    message: "",
    success: false,
};

import { AppButton } from "./ui/app-button";

export function CompleteLessonForm({
    lessonId,
    isCompleted,
}: {
    lessonId: number;
    isCompleted: boolean;
}) {
    const completeLessonWithId = completeLessonAction.bind(null, lessonId);

    const [_state, formAction, isPending] = useActionState(
        completeLessonWithId,
        initialState,
    );

    return (
        <form action={formAction}>
            <AppButton
                type="submit"
                disabled={isCompleted || isPending}
                variant={isCompleted ? "success" : "secondary"}
                size="sm"
                className={
                    isCompleted
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-200 border-gray-300 text-gray-700"
                }
            >
                {isCompleted ? "✅ DONE" : isPending ? "..." : "START"}
            </AppButton>
        </form>
    );
}
