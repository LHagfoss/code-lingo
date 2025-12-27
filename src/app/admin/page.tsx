import Link from "next/link";
import { auth } from "@/auth";
import { getAuthUser } from "@/queries/user/users";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function AdminPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();

    if (user?.role !== "admin") {
        redirect("/learn");
    }

    return (
        <PageWrapper>
            <div className={"max-w-lg mx-auto flex flex-col gap-2"}>
                <Card>
                    <h1 className="text-3xl font-bold text-slate-700">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500">
                        This is the admin dashboard page.
                    </p>
                </Card>

                <Card className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Users</h2>
                    <p className="text-slate-500">Manage registered users.</p>
                </Card>

                <Link
                    href="/admin/courses"
                    className="block transition-transform hover:scale-105 active:scale-95"
                >
                    <Card className="flex flex-col gap-2 h-full border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer">
                        <h2 className="text-xl font-bold text-blue-700">
                            Courses
                        </h2>
                        <p className="text-slate-600 font-bold">
                            Manage course content →
                        </p>
                    </Card>
                </Link>

                <Card className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Analytics</h2>
                    <p className="text-slate-500">View platform stats.</p>
                </Card>
            </div>
        </PageWrapper>
    );
}
