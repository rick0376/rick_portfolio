// src/app/(admin)/admin/page.tsx

import {
    ArrowRight,
    BriefcaseBusiness,
    FolderTree,
    MessageSquareText,
    Plus,
    Tags,
} from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export default async function AdminDashboardPage() {
    const [
        projectsCount,
        categoriesCount,
        technologiesCount,
        newMessagesCount,
        recentProjects,
    ] = await Promise.all([
        prisma.project.count(),
        prisma.category.count(),
        prisma.technology.count(),
        prisma.contactMessage.count({
            where: {
                status: "NEW",
            },
        }),
        prisma.project.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                type: true,
                status: true,
                createdAt: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        }),
    ]);

    const stats = [
        {
            title: "Projetos",
            value: projectsCount,
            description: "Projetos cadastrados",
            icon: BriefcaseBusiness,
            href: "/admin/projetos",
            color: "blue",
        },
        {
            title: "Categorias",
            value: categoriesCount,
            description: "Categorias disponíveis",
            icon: FolderTree,
            href: "/admin/categorias",
            color: "cyan",
        },
        {
            title: "Tecnologias",
            value: technologiesCount,
            description: "Tecnologias cadastradas",
            icon: Tags,
            href: "/admin/tecnologias",
            color: "violet",
        },
        {
            title: "Mensagens",
            value: newMessagesCount,
            description: "Novas mensagens",
            icon: MessageSquareText,
            href: "/admin/mensagens",
            color: "orange",
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <span className={styles.eyebrow}>
                        PAINEL DE CONTROLE
                    </span>

                    <h1>Visão geral</h1>

                    <p>
                        Gerencie o conteúdo e acompanhe as informações
                        do seu portfólio.
                    </p>
                </div>

                <Link
                    className={styles.newProjectButton}
                    href="/admin/projetos/novo"
                >
                    <Plus size={19} />
                    Novo projeto
                </Link>
            </div>

            <section
                className={styles.statsGrid}
                aria-label="Resumo do portfólio"
            >
                {stats.map(
                    ({
                        title,
                        value,
                        description,
                        icon: Icon,
                        href,
                        color,
                    }) => (
                        <Link
                            key={title}
                            className={`${styles.statCard} ${styles[color]
                                }`}
                            href={href}
                        >
                            <div className={styles.statTop}>
                                <span className={styles.statIcon}>
                                    <Icon size={22} />
                                </span>

                                <ArrowRight size={18} />
                            </div>

                            <strong className={styles.statValue}>
                                {value}
                            </strong>

                            <span className={styles.statTitle}>
                                {title}
                            </span>

                            <small>{description}</small>
                        </Link>
                    ),
                )}
            </section>

            <section className={styles.recentSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2>Projetos recentes</h2>
                        <p>
                            Últimos projetos adicionados ao portfólio.
                        </p>
                    </div>

                    <Link href="/admin/projetos">
                        Ver todos
                        <ArrowRight size={17} />
                    </Link>
                </div>

                {recentProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span>
                            <BriefcaseBusiness size={27} />
                        </span>

                        <h3>Nenhum projeto cadastrado</h3>

                        <p>
                            Cadastre seu primeiro projeto para começar a
                            preencher o portfólio.
                        </p>

                        <Link href="/admin/projetos/novo">
                            <Plus size={18} />
                            Cadastrar projeto
                        </Link>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Projeto</th>
                                    <th>Categoria</th>
                                    <th>Tipo</th>
                                    <th>Status</th>
                                    <th>Cadastro</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentProjects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <strong>
                                                {project.title}
                                            </strong>
                                        </td>

                                        <td>
                                            {project.category?.name ??
                                                "Sem categoria"}
                                        </td>

                                        <td>
                                            {project.type.replaceAll(
                                                "_",
                                                " ",
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={`${styles.status} ${styles[
                                                    project.status.toLowerCase()
                                                    ]
                                                    }`}
                                            >
                                                {project.status ===
                                                    "PUBLISHED"
                                                    ? "Publicado"
                                                    : project.status ===
                                                        "ARCHIVED"
                                                        ? "Arquivado"
                                                        : "Rascunho"}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(
                                                project.createdAt,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}