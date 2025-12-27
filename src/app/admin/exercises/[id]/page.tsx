import { auth } from "@/auth";
import { getAuthUser } from "@/queries/user/users";
import { getExerciseWithOptions } from "@/queries/admin/exercises";
import { redirect } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";
import { AddOptionForm } from "@/components/admin/add-option-form";
import { deleteOptionAction } from "@/actions/admin/options";
import { cn } from "@/utils/cn";
import { PageWrapper } from "@/components/ui/page-wrapper";
import Separator from "@/components/separator";

export default async function ExerciseAdminPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    const exercise = await getExerciseWithOptions(params.id);

    if (!exercise) {
        return <div className="p-10 text-center">Exercise not found</div>;
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-700">
                            {exercise.question}
                        </h1>
                        <p className="text-slate-500 font-bold">
                            Exercise Options Manager
                        </p>
                    </div>
                    <div className="ml-auto">
                        <AppButton
                            href={`/admin/lessons/${exercise.lesson_id}`}
                            variant="secondary"
                        >
                            ← Back to Exercises
                        </AppButton>
                    </div>
                </div>

                <Separator />

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-700">
                        Answer Options
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {exercise.challenge_options &&
                        exercise.challenge_options.length > 0 ? (
                            exercise.challenge_options.map((option: any) => (
                                <Card
                                    key={option.id}
                                    className={cn(
                                        "flex flex-col justify-between gap-4 transition-all",
                                        option.correct
                                            ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                                            : "hover:bg-slate-50",
                                    )}
                                >
                                    <div className="flex items-start justify-between w-full">
                                        <h3 className="text-lg font-bold text-slate-800 break-words">
                                            {option.text}
                                        </h3>
                                        {option.correct && (
                                            <span className="bg-green-200 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase shrink-0">
                                                Correct
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-auto">
                                        <form
                                            action={deleteOptionAction.bind(
                                                null,
                                                option.id,
                                                exercise.id,
                                            )}
                                        >
                                            <AppButton
                                                variant="danger"
                                                size="sm"
                                                type="submit"
                                            >
                                                Delete
                                            </AppButton>
                                        </form>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                No options added yet. Add choices below!
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <AddOptionForm exerciseId={exercise.id} />
            </div>
        </PageWrapper>
    );
}
