import { signOutAction } from "@/actions/auth";
import { AppButton } from "@/components/ui/app-button";

export function SignOut() {
    return (
        <form action={signOutAction}>
            <AppButton variant="danger" size="md">
                Sign Out
            </AppButton>
        </form>
    );
}
