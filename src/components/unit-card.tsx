import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

type UnitProps = {
    id: number;
    title: string;
    description: string;
    lessons: {
        id: number;
        title: string;
        order: number;
    }[];
    allProgress: any[];
};

export function UnitCard({
    unit,
    allProgress,
}: {
    unit: UnitProps;
    allProgress: any[];
}) {
    return (
        <div className="space-y-4 mb-8">
            <div className="bg-blue-600 border-2 border-b-4 border-blue-700 text-white p-4 rounded-xl">
                <AppText as="h2" size="xl" variant="inverted">
                    {unit.title}
                </AppText>
                <AppText size="sm" className="text-blue-100">
                    {unit.description}
                </AppText>
            </div>

            <div className="flex flex-col gap-3">
                {unit.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => {
                        const isCompleted = allProgress?.some(
                            (p) => p.lesson_id === lesson.id && p.completed,
                        );

                        return (
                            <Card
                                key={lesson.id}
                                className={cn(
                                    "flex items-center justify-between transition-all hover:bg-slate-50",
                                    isCompleted &&
                                        "bg-green-50 border-green-200 border-b-green-300",
                                )}
                            >
                                <div className="flex flex-col">
                                    <AppText className="text-slate-700">
                                        {lesson.title}
                                    </AppText>
                                    <AppText size="xs" variant="subtle">
                                        Lesson {lesson.order}
                                    </AppText>
                                </div>

                                {isCompleted ? (
                                    <AppText
                                        variant="success"
                                        className="px-4 py-2 bg-white/50 rounded-lg"
                                    >
                                        ✅ Done
                                    </AppText>
                                ) : (
                                    <AppButton
                                        href={`/learn/lesson/${lesson.id}`}
                                        variant="primary"
                                        size="sm"
                                    >
                                        START
                                    </AppButton>
                                )}
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
}
