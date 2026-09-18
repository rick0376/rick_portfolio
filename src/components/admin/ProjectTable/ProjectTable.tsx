// src/components/admin/ProjectTable/ProjectTable.tsx

"use client";

import {
    AlertTriangle,
    Archive,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Edit3,
    ExternalLink,
    ImageIcon,
    LoaderCircle,
    Search,
    Star,
    Trash2,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";

export type AdminProjectItem = {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    type: string;
    status: string;
    featured: boolean;
    position: number;
    coverImageUrl: string | null;
    category: {
        name: string;
    } | null;
    technologies: {
        technology: {
            id: string;
            name: string;
        };
    }[];
    imagesCount: number;
    createdAt: string;
    updatedAt: string;
};

type ProjectTableProps = {
    initialProjects: AdminProjectItem[];
};

const statusLabels: Record<string, string> = {
    DRAFT: "Rascunho",
    PUBLISHED: "Publicado",
    ARCHIVED: "Arquivado",
};

const typeLabels: Record<string, string> = {
    NEXT_JS: "Next.js",
    REACT_NATIVE: "React Native",
    POWER_BI: "Power BI",
    WEBSITE: "Website",
    DASHBOARD: "Dashboard",
    MOBILE: "Aplicativo mobile",
    OTHER: "Outro",
};

export default function ProjectTable({
    initialProjects,
}: ProjectTableProps) {
    const [projects, setProjects] =
        useState(initialProjects);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [projectToDelete, setProjectToDelete] =
        useState<AdminProjectItem | null>(null);

    const [deleting, setDeleting] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        return projects.filter((project) => {
            const matchesStatus =
                statusFilter === "ALL" ||
                project.status === statusFilter;

            const matchesSearch =
                !normalizedSearch ||
                project.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                project.shortDescription
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                project.category?.name
                    .toLowerCase()
                    .includes(normalizedSearch);

            return matchesStatus && matchesSearch;
        });
    }, [projects, search, statusFilter]);

    async function handleDelete() {
        if (!projectToDelete) {
            return;
        }

        setDeleting(true);
        setMessage("");

        try {
            const response = await fetch(
                `/api/projects/${projectToDelete.id}`,
                {
                    method: "DELETE",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível excluir o projeto.",
                );
            }

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (project) =>
                        project.id !== projectToDelete.id,
                ),
            );

            setProjectToDelete(null);
            setMessage(
                data.message ||
                "Projeto excluído com sucesso.",
            );
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir o projeto.",
            );
        } finally {
            setDeleting(false);
        }
    }

    function getStatusIcon(status: string) {
        if (status === "PUBLISHED") {
            return <CheckCircle2 size={14} />;
        }

        if (status === "ARCHIVED") {
            return <Archive size={14} />;
        }

        return <Clock3 size={14} />;
    }

    return (
        <div className={styles.wrapper}>
            {message && (
                <div className={styles.message}>
                    <CheckCircle2 size={17} />
                    {message}

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Fechar mensagem"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            <div className={styles.filters}>
                <div className={styles.search}>
                    <Search size={18} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Buscar projeto, descrição ou categoria..."
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

                <div className={styles.statusFilters}>
                    {[
                        ["ALL", "Todos"],
                        ["PUBLISHED", "Publicados"],
                        ["DRAFT", "Rascunhos"],
                        ["ARCHIVED", "Arquivados"],
                    ].map(([value, label]) => (
                        <button
                            className={
                                statusFilter === value
                                    ? styles.activeFilter
                                    : undefined
                            }
                            type="button"
                            key={value}
                            onClick={() =>
                                setStatusFilter(value)
                            }
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className={styles.grid}>
                    {filteredProjects.map((project) => (
                        <article
                            className={styles.card}
                            key={project.id}
                        >
                            <div className={styles.cover}>
                                {project.coverImageUrl ? (
                                    <Image
                                        src={project.coverImageUrl}
                                        alt={`Capa do projeto ${project.title}`}
                                        fill
                                        sizes="(max-width: 750px) 100vw, 340px"
                                    />
                                ) : (
                                    <div
                                        className={
                                            styles.emptyCover
                                        }
                                    >
                                        <ImageIcon size={30} />
                                        <span>Sem imagem de capa</span>
                                    </div>
                                )}

                                <div
                                    className={
                                        styles.coverOverlay
                                    }
                                />

                                <span
                                    className={`${styles.status} ${styles[
                                        project.status.toLowerCase()
                                        ]
                                        }`}
                                >
                                    {getStatusIcon(project.status)}
                                    {statusLabels[project.status] ||
                                        project.status}
                                </span>

                                {project.featured && (
                                    <span
                                        className={styles.featured}
                                    >
                                        <Star size={13} />
                                        Destaque
                                    </span>
                                )}
                            </div>

                            <div className={styles.content}>
                                <div
                                    className={styles.cardHeader}
                                >
                                    <div>
                                        <span
                                            className={styles.type}
                                        >
                                            {typeLabels[project.type] ||
                                                project.type}
                                        </span>

                                        <h2>{project.title}</h2>
                                    </div>

                                    <span
                                        className={
                                            styles.position
                                        }
                                    >
                                        #{project.position}
                                    </span>
                                </div>

                                <p>{project.shortDescription}</p>

                                <div className={styles.metadata}>
                                    <span>
                                        {project.category?.name ||
                                            "Sem categoria"}
                                    </span>

                                    <span>
                                        {project.imagesCount}{" "}
                                        {project.imagesCount === 1
                                            ? "imagem"
                                            : "imagens"}
                                    </span>
                                </div>

                                <div
                                    className={styles.technologies}
                                >
                                    {project.technologies
                                        .slice(0, 4)
                                        .map(({ technology }) => (
                                            <span key={technology.id}>
                                                {technology.name}
                                            </span>
                                        ))}

                                    {project.technologies.length >
                                        4 && (
                                            <span>
                                                +
                                                {project.technologies.length -
                                                    4}
                                            </span>
                                        )}
                                </div>

                                <div className={styles.actions}>
                                    <Link
                                        href={`/admin/projetos/${project.id}`}
                                    >
                                        <Edit3 size={16} />
                                        Editar
                                    </Link>

                                    {project.status ===
                                        "PUBLISHED" && (
                                            <Link
                                                href={`/projetos/${project.slug}`}
                                                target="_blank"
                                            >
                                                <ExternalLink size={16} />
                                                Visualizar
                                            </Link>
                                        )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProjectToDelete(project)
                                        }
                                        aria-label={`Excluir ${project.title}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <span>
                        <Search size={30} />
                    </span>

                    <h2>Nenhum projeto encontrado</h2>

                    <p>
                        Altere os filtros ou cadastre um
                        novo projeto.
                    </p>

                    <Link href="/admin/projetos/novo">
                        Cadastrar projeto
                        <ArrowUpRight size={17} />
                    </Link>
                </div>
            )}

            {projectToDelete && (
                <div
                    className={styles.modalBackdrop}
                    role="presentation"
                    onMouseDown={() => {
                        if (!deleting) {
                            setProjectToDelete(null);
                        }
                    }}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-project-title"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className={styles.closeModal}
                            type="button"
                            onClick={() =>
                                setProjectToDelete(null)
                            }
                            disabled={deleting}
                            aria-label="Fechar"
                        >
                            <X size={18} />
                        </button>

                        <span
                            className={styles.warningIcon}
                        >
                            <AlertTriangle size={28} />
                        </span>

                        <h2 id="delete-project-title">
                            Excluir projeto?
                        </h2>

                        <p>
                            O projeto{" "}
                            <strong>
                                {projectToDelete.title}
                            </strong>{" "}
                            será excluído do banco e suas
                            imagens serão removidas do
                            Cloudinary.
                        </p>

                        <div
                            className={styles.modalActions}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setProjectToDelete(null)
                                }
                                disabled={deleting}
                            >
                                Cancelar
                            </button>

                            <button
                                className={
                                    styles.confirmDelete
                                }
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <LoaderCircle
                                        className={styles.spin}
                                        size={17}
                                    />
                                ) : (
                                    <Trash2 size={17} />
                                )}

                                {deleting
                                    ? "Excluindo..."
                                    : "Excluir projeto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}