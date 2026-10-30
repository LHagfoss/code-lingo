import Image from "next/image";
import { redirect } from "next/navigation";
import { updateUserActiveCourse } from "@/actions/user/account";
import { auth } from "@/auth";
import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getCourses } from "@/queries/user/courses";
import { getAuthUser } from "@/queries/user/users";

export default async function CoursesPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const courses = await getCourses();
    const user = await getAuthUser();

    if (!user?.onboarding_completed) redirect("/onboarding");

    return (
        <PageWrapper>
            <div className="space-y-8 mx-auto">
                <h1 className="text-3xl font-bold text-slate-700">
                    Language Courses
                </h1>

                <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {courses.map((course: any) => {
                        const isActive = user?.active_course_id === course.id;

                        return (
                            <Card
                                key={course.id}
                                className={`flex gap-4 ${
                                    isActive
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                        : ""
                                }`}
                            >
                                <div className="flex-1 relative bg-slate-200 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                                    {course.image_src ? (
                                        <Image
                                            src={course.image_src}
                                            alt={course.title}
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="text-4xl">
                                            No image📚
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <AppText size="2xl">
                                            {course.title}
                                        </AppText>
                                    </div>

                                    <form
                                        action={updateUserActiveCourse.bind(
                                            null,
                                            course.id,
                                        )}
                                        className="w-full"
                                    >
                                        <AppButton
                                            variant={
                                                isActive
                                                    ? "secondary"
                                                    : "primary"
                                            }
                                            disabled={isActive}
                                            size="sm"
                                            type="submit"
                                            fullWidth
                                        >
                                            {isActive
                                                ? "Currently Learning"
                                                : "Switch Course"}
                                        </AppButton>
                                    </form>
                                </div>
                            </Card>
                        );
                    })}

                    {courses.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            <p className="text-xl font-bold">
                                No courses found.
                            </p>
                            <p>Create one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
