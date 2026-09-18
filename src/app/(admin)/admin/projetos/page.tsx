// src/app/(admin)/admin/projetos/page.tsx

import ProjectTable from "@/components/admin/ProjectTable/ProjectTable";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    await requireAdmin();

    const projects = await prisma.project.findMany({
        orderBy: [
            {
                position: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            images: {
                select: {
                    id: true,
                },
            },
            technologies: {
                include: {
                    technology: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    const formattedProjects = projects.map(
        (project) => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            shortDescription:
                project.shortDescription,
            type: project.type,
            status: project.status,
            featured: project.featured,
            position: project.position,
            coverImageUrl:
                project.coverImageUrl,
            category: project.category,
            technologies:
                project.technologies,
            imagesCount: project.images.length,
            createdAt:
                project.createdAt.toISOString(),
            updatedAt:
                project.updatedAt.toISOString(),
        }),
    );

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroGlow} />

                <div>
                    <span className={styles.eyebrow}>
                        <Sparkles size={14} />
                        Gestão do portfólio
                    </span>

                    <h1>Projetos</h1>

                    <p>
                        Cadastre, publique e organize os
                        trabalhos apresentados no seu
                        portfólio.
                    </p>
                </div>

                <Link href="/admin/projetos/novo">
                    <Plus size={18} />
                    Novo projeto
                </Link>
            </header>

            <ProjectTable
                initialProjects={formattedProjects}
            />
        </div>
    );
}