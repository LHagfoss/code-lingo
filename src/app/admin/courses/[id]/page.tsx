import { redirect } from "next/navigation";
import { deleteUnitAction, moveUnitAction } from "@/actions/admin/units";
import { auth } from "@/auth";
import { AddUnitForm } from "@/components/admin/add-unit-form";
import { EditCourseForm } from "@/components/admin/edit-course-form";
import { AdminItemCard } from "@/components/admin/ui/admin-item-card";
import { AdminList } from "@/components/admin/ui/admin-list";
import { AdminSection } from "@/components/admin/ui/admin-section";
import Separator from "@/components/separator";
import { AppButton } from "@/components/ui/app-button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getCourseWithUnits, getNextUnitOrder } from "@/queries/admin/courses";
import { getAuthUser } from "@/queries/user/users";

export default async function CourseAdminPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const user = await getAuthUser();
    if (user?.role !== "admin") {
        redirect("/learn");
    }

    const [course, nextOrder] = await Promise.all([
        getCourseWithUnits(params.id),
        getNextUnitOrder(params.id),
    ]);

    if (!course) {
        return <div className="p-10 text-center">Course not found</div>;
    }

    return (
        <PageWrapper>
            <div className="space-y-8">
                <EditCourseForm course={course} />

                <Separator />

                <AdminSection title="Units">
                    <AdminList emptyMessage="No units yet. Add one below!">
                        {course.units?.map((unit: any, index: number) => (
                            <AdminItemCard
                                key={unit.id}
                                title={unit.title}
                                subtitle={unit.description}
                                order={unit.order}
                                actions={
                                    <>
                                        <div className="flex flex-col gap-1 mr-2">
                                            <form
                                                action={moveUnitAction.bind(
                                                    null,
                                                    unit.id,
                                                    course.id,
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
                                                action={moveUnitAction.bind(
                                                    null,
                                                    unit.id,
                                                    course.id,
                                                    "down",
                                                )}
                                            >
                                                <AppButton
                                                    variant="ghost"
                                                    size="sm"
                                                    type="submit"
                                                    disabled={
                                                        index ===
                                                        course.units.length - 1
                                                    }
                                                    className="w-8 h-8 p-0"
                                                >
                                                    ▼
                                                </AppButton>
                                            </form>
                                        </div>

                                        <AppButton
                                            href={`/admin/units/${unit.id}`}
                                            variant="primary"
                                            size="sm"
                                            className="flex-1 md:flex-none"
                                        >
                                            Manage Lessons
                                        </AppButton>

                                        <form
                                            action={deleteUnitAction.bind(
                                                null,
                                                unit.id,
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
                                    </>
                                }
                            />
                        ))}
                    </AdminList>
                </AdminSection>

                <Separator />

                <AddUnitForm courseId={course.id} nextOrder={nextOrder} />
            </div>
        </PageWrapper>
    );
}
