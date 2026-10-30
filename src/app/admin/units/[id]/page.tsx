import { redirect } from "next/navigation";
import { deleteLessonAction, moveLessonAction } from "@/actions/admin/lessons";
import { auth } from "@/auth";
import { AddLessonForm } from "@/components/admin/add-lesson-form";
import { AdminHeader } from "@/components/admin/ui/admin-header";
import { AdminItemCard } from "@/components/admin/ui/admin-item-card";
import { AdminList } from "@/components/admin/ui/admin-list";
import { AdminSection } from "@/components/admin/ui/admin-section";
import Separator from "@/components/separator";
import { AppButton } from "@/components/ui/app-button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getNextLessonOrder } from "@/queries/admin/lessons";
import { getUnitWithLessons } from "@/queries/admin/units";
import { getAuthUser } from "@/queries/user/users";

export default async function UnitAdminPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    const [unit, nextOrder] = await Promise.all([
        getUnitWithLessons(params.id),
        getNextLessonOrder(params.id),
    ]);

    if (!unit) {
        return <div className="p-10 text-center">Unit not found</div>;
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <AdminHeader
                    title={unit.title}
                    subtitle={unit.description}
                    backHref={`/admin/courses/${unit.course_id}`}
                    backLabel="Back to Course"
                />

                <Separator />

                <AdminSection title="Lessons">
                    <AdminList emptyMessage="No lessons yet. Add one below!">
                        {unit.lessons?.map((lesson: any, index: number) => (
                            <AdminItemCard
                                key={lesson.id}
                                title={lesson.title}
                                order={lesson.order}
                                actions={
                                    <>
                                        <div className="flex flex-col gap-1 mr-2">
                                            <form
                                                action={moveLessonAction.bind(
                                                    null,
                                                    lesson.id,
                                                    unit.id,
                                                    "up",
                                                )}
                                            >
                                                <AppButton
                                                    variant="ghost"
                                                    size="sm"
                                                    type="submit"
                                                    disabled={index === 0}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    ▲
                                                </AppButton>
                                            </form>
                                            <form
                                                action={moveLessonAction.bind(
                                                    null,
                                                    lesson.id,
                                                    unit.id,
                                                    "down",
                                                )}
                                            >
                                                <AppButton
                                                    variant="ghost"
                                                    size="sm"
                                                    type="submit"
                                                    disabled={
                                                        index ===
                                                        unit.lessons.length - 1
                                                    }
                                                    className="w-8 h-8 p-0"
                                                >
                                                    ▼
                                                </AppButton>
                                            </form>
                                        </div>

                                        <AppButton
                                            href={`/admin/lessons/${lesson.id}`}
                                            variant="primary"
                                            size="sm"
                                            className="flex-1 md:flex-none"
                                        >
                                            Edit Content
                                        </AppButton>

                                        <form
                                            action={deleteLessonAction.bind(
                                                null,
                                                lesson.id,
                                                unit.id,
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
                                    </>
                                }
                            />
                        ))}
                    </AdminList>
                </AdminSection>

                <Separator />

                <AddLessonForm unitId={unit.id} nextOrder={nextOrder} />
            </div>
        </PageWrapper>
    );
}
