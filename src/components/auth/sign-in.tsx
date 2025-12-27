import { signIn } from "@/auth";
import { FaGoogle } from "react-icons/fa";

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/learn" });
            }}
        >
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-lg text-blue-50 flex items-center gap-2"
            >
                {" "}
                <FaGoogle /> Sign in with Google
            </button>
        </form>
    );
}
