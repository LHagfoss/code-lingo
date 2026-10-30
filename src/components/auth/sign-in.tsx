import { FaGoogle } from "react-icons/fa";
import { signIn } from "@/auth";
import { AppButton } from "../ui/app-button";

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/learn" });
            }}
        >
            <AppButton type="submit" variant="primary" className="gap-2">
                <FaGoogle /> Sign in with Google
            </AppButton>
        </form>
    );
}
