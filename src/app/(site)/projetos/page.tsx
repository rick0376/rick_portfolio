// src/app/(site)/projetos/page.tsx

import ProjectCatalog from "@/components/projects/ProjectCatalog/ProjectCatalog";
import { prisma } from "@/lib/prisma";
import type {
    Project,
    ProjectAccent,
    ProjectType,
} from "@/types/project";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Projetos",
    description:
        "Projetos de sistemas web, aplicativos, dashboards e soluções digitais desenvolvidos por Luis Henrique Pereira.",
};

function getAccent(type: string): ProjectAccent {
    if (
        type === "REACT_NATIVE" ||
        type === "MOBILE"
    ) {
        return "cyan";
    }

    if (
        type === "POWER_BI" ||
        type === "DASHBOARD"
    ) {
        return "violet";
    }

    return "blue";
}

function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
        NEXT_JS: "Sistema web",
        REACT_NATIVE: "Aplicativo mobile",
        POWER_BI: "Power BI",
        WEBSITE: "Website",
        DASHBOARD: "Dashboard",
        MOBILE: "Aplicativo mobile",
        OTHER: "Projeto",
    };

    return labels[type] || "Projeto";
}

export default async function ProjectsPage() {
    const databaseProjects =
        await prisma.project.findMany({
            where: {
                status: "PUBLISHED",
            },
            orderBy: [
                {
                    position: "asc",
                },
                {
                    publishedAt: "desc",
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
                technologies: {
                    include: {
                        technology: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

    const projects: Project[] = databaseProjects.map(
        (project) => ({
            id: project.id,
            slug: project.slug,
            title: project.title,
            summary: project.shortDescription,
            description: project.description,
            category:
                project.category?.name ||
                getTypeLabel(project.type),
            technologies: project.technologies.map(
                ({ technology }) => technology.name,
            ),
            accent: getAccent(project.type),
            status: getTypeLabel(project.type),
            type: project.type as ProjectType,
            featured: project.featured,
            coverImageUrl: project.coverImageUrl,
            coverImagePublicId: project.coverPublicId,
            projectUrl: project.projectUrl,
            githubUrl: project.githubUrl,
        }),
    );

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.glow} />

                <div className={styles.container}>
                    <Link className={styles.backLink} href="/">
                        <ArrowLeft size={16} />
                        Voltar ao início
                    </Link>

                    <div className={styles.heroContent}>
                        <div className={styles.presentation}>
                            <span className={styles.eyebrow}>
                                <Sparkles size={13} />
                                Portfólio profissional
                            </span>

                            <h1>Projetos e soluções digitais</h1>

                            <p>
                                Conheça os sistemas, aplicativos, sites e
                                dashboards desenvolvidos para transformar
                                ideias em resultados reais.
                            </p>
                        </div>

                        <div className={styles.summary}>
                            <span className={styles.summaryIcon}>
                                <BriefcaseBusiness size={19} />
                            </span>

                            <div>
                                <strong>{projects.length}</strong>

                                <small>
                                    {projects.length === 1
                                        ? "projeto publicado"
                                        : "projetos publicados"}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <ProjectCatalog projects={projects} />
                </div>
            </section>
        </main>
    );
}