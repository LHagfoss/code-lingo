import { auth } from "@/auth";
import { getAuthUser } from "@/queries/user/users";
import { redirect } from "next/navigation";
import { CreateCourseForm } from "@/components/admin/create-course-form";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function CreateCoursePage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-slate-700 text-center">
                    Create New Course
                </h1>
                <CreateCourseForm />
            </div>
        </PageWrapper>
    );
}
