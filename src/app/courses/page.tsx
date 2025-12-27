import { auth } from "@/auth";
import { getCourses } from "@/queries/user/courses";
import { getAuthUser } from "@/queries/user/users";
import { updateUserActiveCourse } from "@/actions/user/account";
import { AppButton } from "@/components/ui/app-button";
import { redirect } from "next/navigation";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { AppText } from "@/components/ui/app-text";

export default async function CoursesPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const courses = await getCourses();
    const user = await getAuthUser();

    if (!user?.onboarding_completed) redirect("/onboarding");

    return (
        <PageWrapper>
            <div className="space-y-8">
                <AppText as="h1" size="3xl" className="text-gray-800">
                    Language Courses
                </AppText>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: any) => {
                        const isActive = user?.active_course_id === course.id;

                        return (
                            <Card
                                key={course.id}
                                className={`flex flex-col items-center gap-4 p-6 min-h-[200px] cursor-pointer hover:bg-slate-50 transition-colors ${
                                    isActive
                                        ? "border-blue-500 bg-blue-50 hover:bg-blue-50 ring-2 ring-blue-200"
                                        : ""
                                }`}
                            >
                                <Image
                                    width={128}
                                    height={128}
                                    src={course.image_src}
                                    alt={course.title}
                                    className="w-24 h-24 object-contain"
                                />
                                <AppText as="h2" size="xl">
                                    {course.title}
                                </AppText>

                                <form
                                    action={updateUserActiveCourse.bind(
                                        null,
                                        course.id,
                                    )}
                                    className="w-full mt-auto"
                                >
                                    <AppButton
                                        variant={
                                            isActive ? "secondary" : "primary"
                                        }
                                        disabled={isActive}
                                        fullWidth
                                    >
                                        {isActive
                                            ? "Currently Learning"
                                            : "Switch Course"}
                                    </AppButton>
                                </form>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </PageWrapper>
    );
}
