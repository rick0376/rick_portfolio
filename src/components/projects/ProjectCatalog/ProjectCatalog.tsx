// src/components/projects/ProjectCatalog/ProjectCatalog.tsx

"use client";

import ProjectCard from "@/components/projects/ProjectCard/ProjectCard";
import type { Project } from "@/types/project";
import {
    FolderSearch,
    Search,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";

type ProjectCatalogProps = {
    projects: Project[];
};

export default function ProjectCatalog({
    projects,
}: ProjectCatalogProps) {
    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState("Todos");

    const categories = useMemo(
        () => [
            "Todos",
            ...Array.from(
                new Set(
                    projects.map(
                        (project) => project.category,
                    ),
                ),
            ),
        ],
        [projects],
    );

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return projects.filter((project) => {
            const matchesCategory =
                category === "Todos" ||
                project.category === category;

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

            return (
                matchesCategory && matchesSearch
            );
        });
    }, [projects, search, category]);

    return (
        <div className={styles.catalog}>
            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={18} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Buscar projeto ou tecnologia..."
                        aria-label="Buscar projetos"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
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

            <div className={styles.categories}>
                {categories.map(
                    (categoryOption) => (
                        <button
                            className={
                                category === categoryOption
                                    ? styles.active
                                    : undefined
                            }
                            type="button"
                            key={categoryOption}
                            onClick={() =>
                                setCategory(categoryOption)
                            }
                        >
                            {categoryOption}
                        </button>
                    ),
                )}
            </div>

            {filteredProjects.length > 0 ? (
                <div className={styles.grid}>
                    {filteredProjects.map(
                        (project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                            />
                        ),
                    )}
                </div>
            ) : (
                <div className={styles.empty}>
                    <span>
                        <FolderSearch size={31} />
                    </span>

                    <h2>
                        Nenhum projeto encontrado
                    </h2>

                    <p>
                        Altere a busca ou selecione outra
                        categoria.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setCategory("Todos");
                        }}
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </div>
    );
}