import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { UnitCard } from "@/components/unit-card";
import { getCourseContent } from "@/queries/user/courses";
import { getUserProgress } from "@/queries/user/progress";
import { getAuthUser } from "@/queries/user/users";

export default async function LearnPage() {
    const session = await auth();

    const dbUser = await getAuthUser();
    const course = await getCourseContent();

    console.log("DEBUG: User Active ID:", dbUser?.active_course_id);
    console.log("DEBUG: Loaded Course:", course?.title);

    if (!session?.user) {
        return redirect("/signin");
    }

    if (!dbUser?.onboarding_completed) {
        redirect("/onboarding");
    }

    if (!course) {
        return (
            <div className="p-10 text-center">
                <AppText>No courses found. Run the seed script!</AppText>
            </div>
        );
    }

    const allProgress = await getUserProgress(dbUser?.id);

    return (
        <PageWrapper>
            <div className="max-w-lg mx-auto pb-20">
                <Card className="flex items-center gap-4 mb-8">
                    {session.user.image && (
                        <Image
                            src={session.user.image}
                            alt="User"
                            width={32}
                            height={32}
                            priority
                            className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-sm"
                        />
                    )}
                    <div>
                        <AppText size="lg" className="text-gray-900">
                            {course.title} Course
                        </AppText>
                        <AppText
                            size="sm"
                            variant="subtle"
                            className="text-gray-500"
                        >
                            Welcome back, {dbUser?.name?.split(" ")[0]}
                        </AppText>
                    </div>
                </Card>

                {course.units.length === 0 && (
                    <div className="text-center">
                        <AppText>No units found in this course.</AppText>
                        <AppText>Come back later.</AppText>
                    </div>
                )}

                {course.units
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((unit: any) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            allProgress={allProgress || []}
                        />
                    ))}
            </div>
        </PageWrapper>
    );
}
