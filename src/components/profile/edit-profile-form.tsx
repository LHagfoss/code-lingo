"use client";

import Image from "next/image";
import { Activity, useActionState, useState } from "react";
import { updateProfileAction } from "@/actions/user/account";
import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Card } from "@/components/ui/card";

type Props = {
    user: {
        name: string;
        image?: string | null;
        email: string;
    };
};

const initialState = {
    message: "",
    success: false,
};

export function EditProfileForm({ user }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        initialState,
    );

    return (
        <>
            <Activity mode={!isEditing ? "visible" : "hidden"}>
                <Card className="flex flex-col items-center gap-4 py-8 relative">
                    <AppButton
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 text-slate-400 hover:text-blue-500"
                    >
                        EDIT
                    </AppButton>

                    <div className="relative">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-sm object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl border-4 border-slate-100">
                                👤
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <AppText as="h1" size="2xl" variant="primary">
                            {user.name}
                        </AppText>
                        <AppText variant="secondary">{user.email}</AppText>
                    </div>
                </Card>
            </Activity>

            <Activity mode={isEditing ? "visible" : "hidden"}>
                <Card className="flex flex-col gap-6 py-8 relative border-blue-200 bg-blue-50/30">
                    <div className="flex justify-between items-center px-4">
                        <AppText size="lg" variant="primary">
                            Edit Profile
                        </AppText>
                        <AppButton
                            onClick={() => setIsEditing(false)}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </AppButton>
                    </div>

                    <form
                        action={(formData) => {
                            formAction(formData);
                            // If successful, we might want to close edit mode, but state updates happen after render.
                            // For simplicity, we keep it open to show the success message.
                        }}
                        className="space-y-4 px-4"
                    >
                        <div>
                            <label
                                htmlFor="profile-name"
                                className="block text-sm font-bold text-slate-700 mb-1"
                            >
                                Display Name
                            </label>
                            <input
                                id="profile-name"
                                name="name"
                                defaultValue={user.name}
                                className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-bold text-slate-700 bg-white"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="profile-avatar"
                                className="block text-sm font-bold text-slate-700 mb-1"
                            >
                                Avatar
                            </label>
                            <input
                                id="profile-avatar"
                                type="file"
                                name="image"
                                accept="image/*"
                                className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 font-bold text-slate-700 bg-white"
                            />
                            <AppText
                                size="xs"
                                variant="subtle"
                                className="mt-1"
                            >
                                Upload a new profile picture.
                            </AppText>
                        </div>

                        {state?.message && (
                            <div
                                className={`p-3 rounded-lg text-sm font-bold ${state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                            >
                                {state.message}
                            </div>
                        )}

                        <div className="pt-2">
                            <AppButton
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={isPending}
                            >
                                {isPending ? "Saving..." : "Save Changes"}
                            </AppButton>
                        </div>
                    </form>
                </Card>
            </Activity>
        </>
    );
}
