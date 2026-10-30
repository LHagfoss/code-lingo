import Image from "next/image";
import { redirect } from "next/navigation";
import { deleteCourseAction } from "@/actions/admin/courses";
import { auth } from "@/auth";
import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getCourses } from "@/queries/user/courses";
import { getAuthUser } from "@/queries/user/users";

export default async function AdminCoursesPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    const courses = await getCourses();

    return (
        <PageWrapper>
            <div className="space-y-8 mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-700">
                        Manage Courses
                    </h1>
                    <AppButton href="/admin/courses/create" variant="primary">
                        + Create Course
                    </AppButton>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {courses.map((course: any) => (
                        <Card key={course.id} className="flex gap-4">
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
                                    <span className="text-4xl">No image📚</span>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex-1">
                                    <AppText size="2xl">{course.title}</AppText>
                                    <AppText size="sm" className="">
                                        {course.slug}
                                    </AppText>
                                </div>

                                <div className="flex gap-2">
                                    <AppButton
                                        href={`/admin/courses/${course.id}`}
                                        variant="secondary"
                                        size="sm"
                                        fullWidth
                                    >
                                        Edit
                                    </AppButton>

                                    <form
                                        className="w-full"
                                        action={deleteCourseAction.bind(
                                            null,
                                            course.id,
                                        )}
                                    >
                                        <AppButton
                                            variant="danger"
                                            size="sm"
                                            type="submit"
                                            fullWidth
                                        >
                                            Delete
                                        </AppButton>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    ))}

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
