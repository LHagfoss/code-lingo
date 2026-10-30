import { redirect } from "next/navigation";
import { BiUser } from "react-icons/bi";
import { auth } from "@/auth";
import { AppButton } from "@/components/ui/app-button";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getAuthUser } from "@/queries/user/users";

export default async function AdminPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();

    if (user?.role !== "admin") {
        redirect("/learn");
    }

    return (
        <PageWrapper>
            <div className={"mx-auto flex flex-col gap-6"}>
                <div className="">
                    <h1 className="text-3xl font-bold text-slate-700">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500">
                        This is the admin dashboard page.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <Card className="flex flex-col gap-2">
                        <div className="bg-blue-100 text-blue-400 h-12 w-12 flex items-center justify-center rounded-md">
                            <BiUser color="inherit" size={32} />
                        </div>

                        <h2 className="text-xl font-bold">Users</h2>
                        <p className="text-slate-500">
                            Manage registered users.
                        </p>
                    </Card>

                    <Card className="flex flex-col gap-2 h-full ">
                        <div className="bg-blue-100 text-blue-400 h-12 w-12 flex items-center justify-center rounded-md">
                            <BiUser color="inherit" size={32} />
                        </div>

                        <h2 className="text-xl font-bold text-blue-700">
                            Courses
                        </h2>
                        <p className="text-slate-600 font-bold">
                            Manage course content
                        </p>

                        <AppButton href="/admin/courses">Go to</AppButton>
                    </Card>

                    <Card className="flex flex-col gap-2">
                        <div className="bg-blue-100 text-blue-400 h-12 w-12 flex items-center justify-center rounded-md">
                            <BiUser color="inherit" size={32} />
                        </div>

                        <h2 className="text-xl font-bold">Analytics</h2>
                        <p className="text-slate-500">View platform stats.</p>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
}
