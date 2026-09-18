// src/app/(admin)/admin/projetos/novo/page.tsx

import ProjectForm from "@/components/admin/ProjectForm/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
    await requireAdmin();

    const [categories, technologies] = await Promise.all([
        prisma.category.findMany({
            where: {
                active: true,
            },
            orderBy: [
                {
                    position: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
            },
        }),
        prisma.technology.findMany({
            where: {
                active: true,
            },
            orderBy: [
                {
                    position: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
                color: true,
            },
        }),
    ]);

    return (
        <ProjectForm
            categories={categories}
            technologies={technologies}
        />
    );
}