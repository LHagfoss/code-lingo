import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { QuizCore } from "@/components/quiz/quiz-core";
import { getAdminClient } from "@/queries/user/progress";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const { id } = await params;
    const lessonId = parseInt(id, 10);

    const supabase = getAdminClient();
    const { data: lesson } = await supabase
        .from("lessons")
        .select(`
      *,
      exercises (
        id,
        question,
        type,
        challenge_options (
          id,
          text,
          correct,
          image_src
        )
      )
    `)
        .eq("id", lessonId)
        .single();

    if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold mb-4">Lesson not ready</h1>
                <Link href="/learn" className="text-blue-500 underline">
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white">
            {/* Top Bar Navigation */}
            <div className="p-4 border-b">
                <Link
                    href="/learn"
                    className="text-gray-400 hover:text-gray-600"
                >
                    X
                </Link>
            </div>

            {/* The Game Engine */}
            <QuizCore
                lessonId={lesson.id}
                initialExercises={lesson.exercises}
            />
        </div>
    );
}
