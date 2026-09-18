// src/components/admin/AdminShell/AdminShell.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar/AdminSidebar";

import styles from "./styles.module.scss";

type AdminShellProps = {
    adminName: string;
    adminEmail: string;
    children: React.ReactNode;
};

export default function AdminShell({
    adminName,
    adminEmail,
    children,
}: AdminShellProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen
            ? "hidden"
            : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    return (
        <div className={styles.shell}>
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className={styles.contentArea}>
                <AdminHeader
                    adminName={adminName}
                    adminEmail={adminEmail}
                    onOpenMenu={() => setSidebarOpen(true)}
                />

                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}