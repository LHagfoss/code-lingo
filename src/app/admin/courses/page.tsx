import { auth } from "@/auth";
import { getAuthUser } from "@/queries/user/users";
import { getCourses } from "@/queries/user/courses";
import { redirect } from "next/navigation";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { deleteCourseAction } from "@/actions/admin/courses";
import { PageWrapper } from "@/components/ui/page-wrapper";

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

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <Card key={course.id} className="flex flex-col gap-4">
                            <div className="relative w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {course.image_src ? (
                                    <Image
                                        src={course.image_src}
                                        alt={course.title}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                ) : (
                                    <span className="text-4xl">📚</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {course.title}
                                </h2>
                                <p className="text-xs text-slate-400 font-bold uppercase mt-1">
                                    Slug: {course.slug}
                                </p>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                                {/* In a real app we'd link to an edit page */}
                                <AppButton
                                    href={`/admin/courses/${course.id}`}
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                >
                                    Edit
                                </AppButton>

                                <form
                                    action={deleteCourseAction.bind(
                                        null,
                                        course.id,
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
