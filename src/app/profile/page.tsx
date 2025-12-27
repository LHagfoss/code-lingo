import { auth } from "@/auth";
import { getAuthUser } from "@/queries/user/users";
import { getUserProgress } from "@/queries/user/progress";
import { SignOut } from "@/components/auth/sign-out";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageWrapper } from "@/components/ui/page-wrapper";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();

    if (!user?.onboarding_completed) redirect("/onboarding");

    const progress = await getUserProgress(user?.id);

    const completedLessons =
        progress?.filter((p: any) => p.completed).length || 0;
    const totalPoints = completedLessons * 10;
    return (
        <PageWrapper>
            <div className="space-y-8">
                {/* Profile Header */}
                <Card className="flex flex-col items-center gap-4 py-8">
                    {session.user.image ? (
                        <img
                            src={session.user.image}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-sm"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                            👤
                        </div>
                    )}
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-slate-700">
                            {user?.name}
                        </h1>
                        <p className="text-slate-500 font-bold">
                            {user?.email}
                        </p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center py-6">
                        <div className="text-4xl font-extrabold text-blue-500 mb-2">
                            {totalPoints}
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                            Total XP
                        </div>
                    </Card>
                    <Card className="text-center py-6">
                        <div className="text-4xl font-extrabold text-green-500 mb-2">
                            {completedLessons}
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                            Lessons Done
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="font-bold text-xl text-slate-700">
                        Settings
                    </h2>
                    <Card className="p-0 overflow-hidden">
                        <Link
                            href="/courses"
                            className="p-4 hover:bg-slate-50 flex justify-between items-center border-b-2 border-slate-100 transition-colors"
                        >
                            <span className="font-bold text-slate-700">
                                Change Language Course
                            </span>
                            <span className="text-slate-400">→</span>
                        </Link>
                        <div className="p-4 flex justify-between items-center bg-rose-50/30">
                            <span className="font-bold text-rose-600">
                                Account Action
                            </span>
                            <SignOut />
                        </div>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
}
