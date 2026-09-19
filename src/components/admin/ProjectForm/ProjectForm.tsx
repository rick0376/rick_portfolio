// src/components/admin/ProjectForm/ProjectForm.tsx

"use client";

import ImageUploader, {
    type UploadedImage,
} from "@/components/admin/ImageUploader/ImageUploader";
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    FileText,
    FolderTree,
    LoaderCircle,
    Save,
    Settings2,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./styles.module.scss";

type CategoryOption = {
    id: string;
    name: string;
};

type TechnologyOption = {
    id: string;
    name: string;
    color: string | null;
};

export type ProjectFormInitialData = {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    type: string;
    status: string;
    projectUrl: string | null;
    githubUrl: string | null;
    coverImageUrl: string | null;
    coverPublicId: string | null;
    featured: boolean;
    position: number;
    categoryId: string | null;
    technologyIds: string[];
    images: UploadedImage[];
};

type ProjectFormProps = {
    categories: CategoryOption[];
    technologies: TechnologyOption[];
    initialData?: ProjectFormInitialData;
};

export default function ProjectForm({
    categories,
    technologies,
    initialData,
}: ProjectFormProps) {
    const router = useRouter();
    const editing = Boolean(initialData);

    const [title, setTitle] = useState(initialData?.title ?? "");

    const [shortDescription, setShortDescription] = useState(
        initialData?.shortDescription ?? "",
    );

    const [description, setDescription] = useState(
        initialData?.description ?? "",
    );

    const [type, setType] = useState(
        initialData?.type ?? "NEXT_JS",
    );

    const [status, setStatus] = useState(
        initialData?.status ?? "DRAFT",
    );

    const [projectUrl, setProjectUrl] = useState(
        initialData?.projectUrl ?? "",
    );

    const [githubUrl, setGithubUrl] = useState(
        initialData?.githubUrl ?? "",
    );

    const [categoryId, setCategoryId] = useState(
        initialData?.categoryId ?? "",
    );

    const [position, setPosition] = useState(
        initialData?.position ?? 0,
    );

    const [featured, setFeatured] = useState(
        initialData?.featured ?? false,
    );

    const [technologyIds, setTechnologyIds] = useState<string[]>(
        initialData?.technologyIds ?? [],
    );

    const [coverImage, setCoverImage] =
        useState<UploadedImage | null>(
            initialData?.coverImageUrl &&
                initialData.coverPublicId
                ? {
                    imageUrl: initialData.coverImageUrl,
                    publicId: initialData.coverPublicId,
                    altText: `Capa do projeto ${initialData.title}`,
                    position: 0,
                }
                : null,
        );

    const [galleryImages, setGalleryImages] = useState<
        UploadedImage[]
    >(initialData?.images ?? []);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    function toggleTechnology(technologyId: string) {
        setTechnologyIds((currentIds) =>
            currentIds.includes(technologyId)
                ? currentIds.filter(
                    (currentId) => currentId !== technologyId,
                )
                : [...currentIds, technologyId],
        );
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setSuccess(false);

        try {
            const endpoint = editing
                ? `/api/projects/${initialData?.id}`
                : "/api/projects";

            const response = await fetch(endpoint, {
                method: editing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    shortDescription,
                    description,
                    type,
                    status,
                    projectUrl,
                    githubUrl,
                    coverImageUrl: coverImage?.imageUrl ?? null,
                    coverPublicId: coverImage?.publicId ?? null,
                    featured,
                    position,
                    categoryId: categoryId || null,
                    technologyIds,
                    images: galleryImages
                        .filter(
                            (image, index, currentImages) => {
                                const isCover =
                                    image.imageUrl === coverImage?.imageUrl ||
                                    image.publicId === coverImage?.publicId;

                                const isFirstOccurrence =
                                    currentImages.findIndex(
                                        (currentImage) =>
                                            currentImage.imageUrl ===
                                            image.imageUrl ||
                                            currentImage.publicId ===
                                            image.publicId,
                                    ) === index;

                                return !isCover && isFirstOccurrence;
                            },
                        )
                        .map((image, index) => ({
                            imageUrl: image.imageUrl,
                            publicId: image.publicId,
                            altText: image.altText,
                            position: index,
                        })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível salvar o projeto.",
                );
            }

            setSuccess(true);
            setMessage(
                data.message || "Projeto salvo com sucesso.",
            );

            router.refresh();

            window.setTimeout(() => {
                router.push("/admin/projetos");
            }, 800);
        } catch (error) {
            setSuccess(false);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar o projeto.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <header className={styles.pageHeader}>
                <div>
                    <Link href="/admin/projetos">
                        <ArrowLeft size={17} />
                        Voltar aos projetos
                    </Link>

                    <span className={styles.eyebrow}>
                        {editing ? "Editar projeto" : "Novo projeto"}
                    </span>

                    <h1>
                        {editing
                            ? "Atualize seu projeto"
                            : "Cadastre um novo projeto"}
                    </h1>

                    <p>
                        Preencha as informações, imagens, tecnologias e
                        links.
                    </p>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? (
                        <LoaderCircle
                            className={styles.spin}
                            size={18}
                        />
                    ) : (
                        <Save size={18} />
                    )}

                    {saving ? "Salvando..." : "Salvar projeto"}
                </button>
            </header>

            {message && (
                <div
                    className={`${styles.message} ${success ? styles.success : styles.error
                        }`}
                >
                    {success && <CheckCircle2 size={18} />}
                    {message}
                </div>
            )}

            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>
                                <FileText size={20} />
                            </span>

                            <div>
                                <h2>Informações principais</h2>
                                <p>
                                    Apresentação e descrição completa do
                                    projeto.
                                </p>
                            </div>
                        </div>

                        <div className={styles.fields}>
                            <label className={styles.fullField}>
                                <span>Título do projeto</span>

                                <input
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Exemplo: RP Track"
                                    required
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span>Descrição curta</span>

                                <textarea
                                    value={shortDescription}
                                    onChange={(event) =>
                                        setShortDescription(event.target.value)
                                    }
                                    placeholder="Resumo que aparecerá no card."
                                    rows={3}
                                    maxLength={240}
                                    required
                                />

                                <small>
                                    {shortDescription.length}/240 caracteres
                                </small>
                            </label>

                            <label className={styles.fullField}>
                                <span>Descrição completa</span>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Apresente o problema, a solução e os resultados."
                                    rows={8}
                                    required
                                />
                            </label>
                        </div>
                    </section>

                    <ImageUploader
                        coverImage={coverImage}
                        galleryImages={galleryImages}
                        onCoverChange={setCoverImage}
                        onGalleryChange={setGalleryImages}
                    />

                    <section className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>
                                <ExternalLink size={20} />
                            </span>

                            <div>
                                <h2>Links externos</h2>
                                <p>
                                    Projeto publicado e repositório do código.
                                </p>
                            </div>
                        </div>

                        <div className={styles.fields}>
                            <label>
                                <span>Link do projeto</span>

                                <input
                                    type="url"
                                    value={projectUrl}
                                    onChange={(event) =>
                                        setProjectUrl(event.target.value)
                                    }
                                    placeholder="https://meuprojeto.com"
                                />
                            </label>

                            <label>
                                <span>Link do GitHub</span>

                                <input
                                    type="url"
                                    value={githubUrl}
                                    onChange={(event) =>
                                        setGithubUrl(event.target.value)
                                    }
                                    placeholder="https://github.com/usuario/projeto"
                                />
                            </label>
                        </div>
                    </section>
                </div>

                <aside className={styles.sideColumn}>
                    <section className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>
                                <Settings2 size={20} />
                            </span>

                            <div>
                                <h2>Publicação</h2>
                                <p>Organização e visibilidade.</p>
                            </div>
                        </div>

                        <div className={styles.sideFields}>
                            <label>
                                <span>Status</span>

                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                >
                                    <option value="DRAFT">Rascunho</option>
                                    <option value="PUBLISHED">
                                        Publicado
                                    </option>
                                    <option value="ARCHIVED">
                                        Arquivado
                                    </option>
                                </select>
                            </label>

                            <label>
                                <span>Tipo do projeto</span>

                                <select
                                    value={type}
                                    onChange={(event) =>
                                        setType(event.target.value)
                                    }
                                >
                                    <option value="NEXT_JS">Next.js</option>
                                    <option value="REACT_NATIVE">
                                        React Native
                                    </option>
                                    <option value="POWER_BI">
                                        Power BI
                                    </option>
                                    <option value="WEBSITE">Website</option>
                                    <option value="DASHBOARD">
                                        Dashboard
                                    </option>
                                    <option value="MOBILE">
                                        Aplicativo mobile
                                    </option>
                                    <option value="OTHER">Outro</option>
                                </select>
                            </label>

                            <label>
                                <span>Posição</span>

                                <input
                                    type="number"
                                    min={0}
                                    value={position}
                                    onChange={(event) =>
                                        setPosition(Number(event.target.value))
                                    }
                                />
                            </label>

                            <button
                                className={`${styles.featuredButton} ${featured ? styles.featuredActive : ""
                                    }`}
                                type="button"
                                onClick={() =>
                                    setFeatured(
                                        (currentFeatured) =>
                                            !currentFeatured,
                                    )
                                }
                            >
                                <Star size={18} />

                                <span>
                                    <strong>Projeto em destaque</strong>
                                    <small>
                                        Aparecerá na página inicial.
                                    </small>
                                </span>
                            </button>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardTitle}>
                            <span>
                                <FolderTree size={20} />
                            </span>

                            <div>
                                <h2>Classificação</h2>
                                <p>Categoria e tecnologias.</p>
                            </div>
                        </div>

                        <div className={styles.sideFields}>
                            <label>
                                <span>Categoria</span>

                                <select
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(event.target.value)
                                    }
                                >
                                    <option value="">
                                        Sem categoria
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            value={category.id}
                                            key={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className={styles.technologyField}>
                                <span>Tecnologias</span>

                                <div className={styles.technologyList}>
                                    {technologies.length > 0 ? (
                                        technologies.map((technology) => {
                                            const selected =
                                                technologyIds.includes(
                                                    technology.id,
                                                );

                                            return (
                                                <button
                                                    className={
                                                        selected
                                                            ? styles.technologyActive
                                                            : undefined
                                                    }
                                                    type="button"
                                                    key={technology.id}
                                                    onClick={() =>
                                                        toggleTechnology(
                                                            technology.id,
                                                        )
                                                    }
                                                >
                                                    <i
                                                        style={{
                                                            background:
                                                                technology.color ||
                                                                "#2785f5",
                                                        }}
                                                    />

                                                    {technology.name}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <small>
                                            Cadastre tecnologias antes de
                                            selecioná-las.
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </form>
    );
}