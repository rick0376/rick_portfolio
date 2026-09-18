// src/app/(admin)/admin/layout.tsx

import AdminShell from "@/components/admin/AdminShell/AdminShell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const admin = await requireAdmin();

    return (
        <AdminShell
            adminName={admin.name}
            adminEmail={admin.email}
        >
            {children}
        </AdminShell>
    );
}