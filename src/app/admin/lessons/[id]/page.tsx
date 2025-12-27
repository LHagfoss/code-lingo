import { redirect } from "next/navigation";
import { deleteExerciseAction } from "@/actions/admin/exercises";
import { auth } from "@/auth";
import { AddExerciseForm } from "@/components/admin/add-exercise-form";
import Separator from "@/components/separator";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getLessonWithExercises } from "@/queries/admin/lessons";
import { getAuthUser } from "@/queries/user/users";

export default async function LessonAdminPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    const lesson = await getLessonWithExercises(params.id);

    if (!lesson) {
        return <div className="p-10 text-center">Lesson not found</div>;
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-700">
                            {lesson.title}
                        </h1>
                        <p className="text-slate-500 font-bold">
                            Lesson Content Manager
                        </p>
                    </div>
                    <div className="ml-auto">
                        <AppButton
                            href={`/admin/units/${lesson.unit_id}`}
                            variant="secondary"
                        >
                            ← Back to Lessons
                        </AppButton>
                    </div>
                </div>

                <Separator />

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-700">
                        Exercises
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {lesson.exercises && lesson.exercises.length > 0 ? (
                            lesson.exercises.map((exercise: any) => (
                                <Card
                                    key={exercise.id}
                                    className="flex flex-col md:flex-row items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="bg-purple-100 text-purple-600 font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                            {exercise.order}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {exercise.question}
                                            </h3>
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                                                {exercise.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <AppButton
                                            href={`/admin/exercises/${exercise.id}`}
                                            variant="primary"
                                            size="sm"
                                            className="flex-1 md:flex-none"
                                        >
                                            Manage Answers
                                        </AppButton>

                                        <form
                                            action={deleteExerciseAction.bind(
                                                null,
                                                exercise.id,
                                                lesson.id,
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
                            <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                                No exercises yet. Add one below!
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <AddExerciseForm lessonId={lesson.id} />
            </div>
        </PageWrapper>
    );
}
