import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { getAuthUser } from "@/queries/user/users";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CodeLingo",
    description: "The free, fun, and effective way to learn to code.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getAuthUser();

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
            >
                <Header role={user?.role} />
                {children}
            </body>
        </html>
    );
}
