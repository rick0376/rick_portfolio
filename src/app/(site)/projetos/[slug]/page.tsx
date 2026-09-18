// src/app/(site)/projetos/[slug]/page.tsx

import ProjectGallery from "@/components/projects/ProjectGallery/ProjectGallery";
import { prisma } from "@/lib/prisma";
import {
    ArrowLeft,
    ArrowUpRight,
    Github,
    Layers3,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

type ProjectDetailsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

const defaultSocialImage =
    "/images/profile/luis-henrique.png";

const typeLabels: Record<string, string> = {
    NEXT_JS: "Next.js",
    REACT_NATIVE: "React Native",
    POWER_BI: "Power BI",
    WEBSITE: "Website",
    DASHBOARD: "Dashboard",
    MOBILE: "Aplicativo mobile",
    OTHER: "Outro",
};

export async function generateMetadata({
    params,
}: ProjectDetailsPageProps): Promise<Metadata> {
    const { slug } = await params;

    const project = await prisma.project.findFirst({
        where: {
            slug,
            status: "PUBLISHED",
        },
        select: {
            title: true,
            shortDescription: true,
            coverImageUrl: true,
            updatedAt: true,
        },
    });

    if (!project) {
        return {
            title: "Projeto não encontrado",
            description:
                "O projeto solicitado não foi encontrado.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const projectUrl = `${siteUrl}/projetos/${slug}`;

    const socialImage =
        project.coverImageUrl || defaultSocialImage;

    return {
        title: project.title,
        description: project.shortDescription,

        alternates: {
            canonical: projectUrl,
        },

        openGraph: {
            type: "article",
            locale: "pt_BR",
            url: projectUrl,
            siteName: "Portfólio Rick Pereira",
            title: project.title,
            description: project.shortDescription,
            modifiedTime: project.updatedAt.toISOString(),
            authors: ["Luis Henrique Pereira"],
            images: [
                {
                    url: socialImage,
                    width: project.coverImageUrl ? 1200 : 1254,
                    height: project.coverImageUrl ? 630 : 1254,
                    alt: `Imagem de apresentação do projeto ${project.title}`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.shortDescription,
            images: [
                {
                    url: socialImage,
                    alt: `Imagem de apresentação do projeto ${project.title}`,
                },
            ],
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
            },
        },
    };
}

export default async function ProjectDetailsPage({
    params,
}: ProjectDetailsPageProps) {
    const { slug } = await params;

    const project = await prisma.project.findFirst({
        where: {
            slug,
            status: "PUBLISHED",
        },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            images: {
                orderBy: {
                    position: "asc",
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

    if (!project) {
        notFound();
    }

    const typeLabel =
        typeLabels[project.type] || "Projeto";

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGlow} />

                <div className={styles.container}>
                    <Link
                        className={styles.backLink}
                        href="/#projetos"
                    >
                        <ArrowLeft size={17} />
                        Voltar aos projetos
                    </Link>

                    <div className={styles.heroContent}>
                        <div>
                            <span className={styles.eyebrow}>
                                {typeLabel}
                            </span>

                            <h1>{project.title}</h1>

                            <p>
                                {project.shortDescription}
                            </p>
                        </div>

                        <div className={styles.actions}>
                            {project.projectUrl && (
                                <a
                                    className={
                                        styles.primaryButton
                                    }
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Acessar projeto
                                    <ArrowUpRight size={18} />
                                </a>
                            )}

                            {project.githubUrl && (
                                <a
                                    className={
                                        styles.secondaryButton
                                    }
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github size={18} />
                                    Ver código
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <ProjectGallery
                        projectTitle={project.title}
                        coverImageUrl={
                            project.coverImageUrl
                        }
                        images={project.images.map(
                            (image) => ({
                                id: image.id,
                                imageUrl: image.imageUrl,
                                publicId: image.publicId,
                                altText: image.altText,
                                position: image.position,
                            }),
                        )}
                    />

                    <div className={styles.details}>
                        <article
                            className={styles.description}
                        >
                            <span
                                className={
                                    styles.sectionLabel
                                }
                            >
                                Sobre o projeto
                            </span>

                            <h2>
                                Uma solução criada para gerar
                                resultados.
                            </h2>

                            {project.description
                                .split("\n")
                                .filter(Boolean)
                                .map(
                                    (
                                        paragraph,
                                        index,
                                    ) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ),
                                )}
                        </article>

                        <aside
                            className={
                                styles.information
                            }
                        >
                            <div
                                className={
                                    styles.informationTitle
                                }
                            >
                                <Layers3 size={20} />
                                <strong>
                                    Informações
                                </strong>
                            </div>

                            <div
                                className={
                                    styles.informationItem
                                }
                            >
                                <span>Categoria</span>

                                <strong>
                                    {project.category
                                        ?.name ||
                                        "Sem categoria"}
                                </strong>
                            </div>

                            <div
                                className={
                                    styles.informationItem
                                }
                            >
                                <span>Tipo</span>
                                <strong>
                                    {typeLabel}
                                </strong>
                            </div>

                            <div
                                className={
                                    styles.technologies
                                }
                            >
                                <span>
                                    Tecnologias utilizadas
                                </span>

                                <div>
                                    {project
                                        .technologies
                                        .length > 0 ? (
                                        project.technologies.map(
                                            ({
                                                technology,
                                            }) => (
                                                <strong
                                                    key={
                                                        technology.id
                                                    }
                                                >
                                                    {
                                                        technology.name
                                                    }
                                                </strong>
                                            ),
                                        )
                                    ) : (
                                        <strong>
                                            Não informado
                                        </strong>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}