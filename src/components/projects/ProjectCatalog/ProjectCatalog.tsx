// src/components/projects/ProjectCatalog/ProjectCatalog.tsx

"use client";

import ProjectCard from "@/components/projects/ProjectCard/ProjectCard";
import type { Project } from "@/types/project";
import {
    ArrowUpRight,
    BarChart3,
    Boxes,
    FolderSearch,
    Search,
    Sparkles,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import styles from "./styles.module.scss";

type ProjectCatalogProps = {
    projects: Project[];
};

type ProjectFilter =
    | "ALL"
    | "SYSTEMS"
    | "POWER_BI"
    | "APPS"
    | "SITES";

const filters: {
    value: ProjectFilter;
    label: string;
}[] = [
        { value: "ALL", label: "Todos" },
        { value: "SYSTEMS", label: "Sistemas Web" },
        { value: "POWER_BI", label: "Power BI" },
        { value: "APPS", label: "Aplicativos" },
        { value: "SITES", label: "Sites" },
    ];

function isPowerBiProject(project: Project) {
    return (
        project.type === "POWER_BI" ||
        project.type === "DASHBOARD"
    );
}

function matchesFilter(
    project: Project,
    filter: ProjectFilter,
) {
    if (filter === "ALL") {
        return true;
    }

    if (filter === "POWER_BI") {
        return isPowerBiProject(project);
    }

    if (filter === "APPS") {
        return (
            project.type === "REACT_NATIVE" ||
            project.type === "MOBILE"
        );
    }

    if (filter === "SITES") {
        return project.type === "WEBSITE";
    }

    return (
        project.type === "NEXT_JS" ||
        project.type === "OTHER"
    );
}

function StandardGroup({
    title,
    description,
    projects,
    powerBi = false,
}: {
    title: string;
    description: string;
    projects: Project[];
    powerBi?: boolean;
}) {
    if (projects.length === 0) {
        return null;
    }

    const Icon = powerBi ? BarChart3 : Boxes;

    return (
        <section className={styles.group}>
            <header className={styles.groupHeader}>
                <span
                    className={`${styles.groupIcon} ${powerBi
                            ? styles.businessIcon
                            : styles.systemsIcon
                        }`}
                >
                    <Icon size={21} />
                </span>

                <div>
                    <div className={styles.groupTitle}>
                        <h2>{title}</h2>

                        <span>
                            {projects.length}{" "}
                            {projects.length === 1
                                ? "projeto"
                                : "projetos"}
                        </span>
                    </div>

                    <p>{description}</p>
                </div>
            </header>

            <div className={styles.grid}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                    />
                ))}
            </div>
        </section>
    );
}

function PowerBiShowcase({
    projects,
}: {
    projects: Project[];
}) {
    const featuredProject =
        projects.find(
            (project) => project.featured,
        ) || projects[0];

    const otherProjects = projects.filter(
        (project) =>
            project.id !== featuredProject.id,
    );

    return (
        <section className={styles.powerBiShowcase}>
            <article className={styles.powerBiFeatured}>
                <div
                    className={
                        styles.powerBiFeaturedContent
                    }
                >
                    <span
                        className={
                            styles.featuredBadge
                        }
                    >
                        <Sparkles size={14} />
                        Destaque Power BI
                    </span>

                    <span className={styles.powerBiLabel}>
                        <BarChart3 size={18} />
                        Power BI
                    </span>

                    <h2>{featuredProject.title}</h2>

                    <p>{featuredProject.summary}</p>

                    <div
                        className={
                            styles.featuredTechnologies
                        }
                    >
                        {featuredProject.technologies
                            .slice(0, 4)
                            .map((technology) => (
                                <span key={technology}>
                                    {technology}
                                </span>
                            ))}
                    </div>

                    <div
                        className={
                            styles.featuredActions
                        }
                    >
                        <Link
                            href={`/projetos/${featuredProject.slug}`}
                        >
                            Ver detalhes
                            <ArrowUpRight size={17} />
                        </Link>

                        {featuredProject.projectUrl && (
                            <a
                                href={
                                    featuredProject.projectUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir dashboard
                                <ArrowUpRight
                                    size={17}
                                />
                            </a>
                        )}
                    </div>
                </div>

                <Link
                    className={
                        styles.powerBiFeaturedImage
                    }
                    href={`/projetos/${featuredProject.slug}`}
                >
                    {featuredProject.coverImageUrl ? (
                        <Image
                            src={
                                featuredProject.coverImageUrl
                            }
                            alt={`Dashboard ${featuredProject.title}`}
                            fill
                            priority
                            sizes="(max-width: 850px) 100vw, 55vw"
                        />
                    ) : (
                        <span>
                            <BarChart3 size={55} />
                        </span>
                    )}
                </Link>
            </article>

            {otherProjects.length > 0 && (
                <div className={styles.otherDashboards}>
                    <header>
                        <span>
                            Outros dashboards Power BI
                        </span>

                        <h2>
                            Mais projetos em Power BI
                        </h2>

                        <p>
                            Soluções analíticas para
                            diferentes áreas e segmentos.
                        </p>
                    </header>

                    <div
                        className={
                            styles.dashboardGrid
                        }
                    >
                        {otherProjects.map(
                            (project) => (
                                <Link
                                    className={
                                        styles.dashboardCard
                                    }
                                    href={`/projetos/${project.slug}`}
                                    key={project.id}
                                >
                                    <div
                                        className={
                                            styles.dashboardImage
                                        }
                                    >
                                        {project.coverImageUrl ? (
                                            <Image
                                                src={
                                                    project.coverImageUrl
                                                }
                                                alt={`Dashboard ${project.title}`}
                                                fill
                                                sizes="300px"
                                            />
                                        ) : (
                                            <BarChart3
                                                size={32}
                                            />
                                        )}
                                    </div>

                                    <div
                                        className={
                                            styles.dashboardContent
                                        }
                                    >
                                        <span
                                            className={
                                                styles.dashboardIcon
                                            }
                                        >
                                            <BarChart3
                                                size={17}
                                            />
                                        </span>

                                        <div>
                                            <h3>
                                                {
                                                    project.title
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    project.summary
                                                }
                                            </p>

                                            <div
                                                className={
                                                    styles.dashboardTags
                                                }
                                            >
                                                <span>
                                                    Power BI
                                                </span>

                                                {project
                                                    .technologies[1] && (
                                                        <span>
                                                            {
                                                                project
                                                                    .technologies[1]
                                                            }
                                                        </span>
                                                    )}
                                            </div>
                                        </div>

                                        <span
                                            className={
                                                styles.dashboardArrow
                                            }
                                        >
                                            <ArrowUpRight
                                                size={17}
                                            />
                                        </span>
                                    </div>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default function ProjectCatalog({
    projects,
}: ProjectCatalogProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] =
        useState<ProjectFilter>("ALL");

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return projects.filter((project) => {
            const matchesType = matchesFilter(
                project,
                filter,
            );

            const matchesSearch =
                !normalizedSearch ||
                project.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                project.summary
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                project.category
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                project.technologies.some(
                    (technology) =>
                        technology
                            .toLowerCase()
                            .includes(normalizedSearch),
                );

            return matchesType && matchesSearch;
        });
    }, [projects, search, filter]);

    const systemProjects = filteredProjects.filter(
        (project) => !isPowerBiProject(project),
    );

    const powerBiProjects =
        filteredProjects.filter(
            isPowerBiProject,
        );

    function clearFilters() {
        setSearch("");
        setFilter("ALL");
    }

    return (
        <div className={styles.catalog}>
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={18} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Buscar projeto, categoria ou tecnologia..."
                        aria-label="Buscar projetos"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Limpar busca"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <span className={styles.counter}>
                    {filteredProjects.length}{" "}
                    {filteredProjects.length === 1
                        ? "projeto"
                        : "projetos"}
                </span>
            </div>

            <div className={styles.filters}>
                {filters.map((option) => (
                    <button
                        className={
                            filter === option.value
                                ? styles.active
                                : undefined
                        }
                        type="button"
                        key={option.value}
                        onClick={() =>
                            setFilter(option.value)
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {filteredProjects.length > 0 ? (
                filter === "POWER_BI" ? (
                    <PowerBiShowcase
                        projects={powerBiProjects}
                    />
                ) : (
                    <div className={styles.groups}>
                        {filter === "ALL" ? (
                            <>
                                <StandardGroup
                                    title="Sistemas e aplicações"
                                    description="Soluções completas desenvolvidas para necessidades reais."
                                    projects={
                                        systemProjects
                                    }
                                />

                                <StandardGroup
                                    title="Business Intelligence"
                                    description="Dashboards desenvolvidos para análise de dados e apoio à tomada de decisão."
                                    projects={
                                        powerBiProjects
                                    }
                                    powerBi
                                />
                            </>
                        ) : (
                            <StandardGroup
                                title={
                                    filters.find(
                                        (option) =>
                                            option.value ===
                                            filter,
                                    )?.label ||
                                    "Projetos"
                                }
                                description="Projetos desenvolvidos com foco em tecnologia, usabilidade e resultados."
                                projects={
                                    filteredProjects
                                }
                            />
                        )}
                    </div>
                )
            ) : (
                <div className={styles.empty}>
                    <span>
                        <FolderSearch size={31} />
                    </span>

                    <h2>
                        Nenhum projeto encontrado
                    </h2>

                    <p>
                        Altere a busca ou selecione outro
                        tipo de projeto.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </div>
    );
}