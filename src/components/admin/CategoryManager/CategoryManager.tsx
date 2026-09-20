// src/components/admin/CategoryManager/CategoryManager.tsx

"use client";

import {
    Check,
    CheckCircle2,
    FolderTree,
    LoaderCircle,
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    X,
    XCircle,
} from "lucide-react";
import {
    FormEvent,
    useMemo,
    useState,
} from "react";

import styles from "./styles.module.scss";

export type AdminCategory = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
    position: number;
    projectsCount: number;
    createdAt: string;
    updatedAt: string;
};

type CategoryManagerProps = {
    initialCategories: AdminCategory[];
};

type CategoryFormData = {
    name: string;
    description: string;
    position: number;
    active: boolean;
};

const emptyForm: CategoryFormData = {
    name: "",
    description: "",
    position: 0,
    active: true,
};

function sortCategories(categories: AdminCategory[]) {
    return [...categories].sort(
        (firstCategory, secondCategory) =>
            firstCategory.position - secondCategory.position ||
            firstCategory.name.localeCompare(
                secondCategory.name,
                "pt-BR",
            ),
    );
}

export default function CategoryManager({
    initialCategories,
}: CategoryManagerProps) {
    const [categories, setCategories] = useState(
        sortCategories(initialCategories),
    );

    const [formData, setFormData] =
        useState<CategoryFormData>(emptyForm);

    const [editingId, setEditingId] = useState<string | null>(
        null,
    );

    const [search, setSearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(
        null,
    );

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const filteredCategories = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return categories;
        }

        return categories.filter((category) =>
            [
                category.name,
                category.slug,
                category.description || "",
            ].some((value) =>
                value.toLowerCase().includes(searchValue),
            ),
        );
    }, [categories, search]);

    function updateField(
        field: keyof CategoryFormData,
        value: string | number | boolean,
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function resetForm() {
        setEditingId(null);
        setFormData(emptyForm);
        setMessage("");
        setSuccess(false);
    }

    function startEditing(category: AdminCategory) {
        setEditingId(category.id);

        setFormData({
            name: category.name,
            description: category.description || "",
            position: category.position,
            active: category.active,
        });

        setMessage("");
        setSuccess(false);

        document
            .getElementById("formulario-categoria")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setSuccess(false);

        try {
            const endpoint = editingId
                ? `/api/categories/${editingId}`
                : "/api/categories";

            const response = await fetch(endpoint, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível salvar a categoria.",
                );
            }

            const savedCategory =
                data.category as AdminCategory;

            setCategories((current) => {
                const exists = current.some(
                    (category) =>
                        category.id === savedCategory.id,
                );

                const updatedCategories = exists
                    ? current.map((category) =>
                        category.id === savedCategory.id
                            ? savedCategory
                            : category,
                    )
                    : [...current, savedCategory];

                return sortCategories(updatedCategories);
            });

            setSuccess(true);
            setMessage(data.message);
            setEditingId(null);
            setFormData(emptyForm);
        } catch (error) {
            setSuccess(false);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar a categoria.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function toggleStatus(category: AdminCategory) {
        setMessage("");
        setSuccess(false);

        try {
            const response = await fetch(
                `/api/categories/${category.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        active: !category.active,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível alterar o status.",
                );
            }

            setCategories((current) =>
                sortCategories(
                    current.map((currentCategory) =>
                        currentCategory.id === category.id
                            ? data.category
                            : currentCategory,
                    ),
                ),
            );

            setSuccess(true);
            setMessage(data.message);
        } catch (error) {
            setSuccess(false);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível alterar o status.",
            );
        }
    }

    async function deleteCategory(category: AdminCategory) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a categoria "${category.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(category.id);
        setMessage("");
        setSuccess(false);

        try {
            const response = await fetch(
                `/api/categories/${category.id}`,
                {
                    method: "DELETE",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível excluir a categoria.",
                );
            }

            setCategories((current) =>
                current.filter(
                    (currentCategory) =>
                        currentCategory.id !== category.id,
                ),
            );

            if (editingId === category.id) {
                resetForm();
            }

            setSuccess(true);
            setMessage(data.message);
        } catch (error) {
            setSuccess(false);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a categoria.",
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className={styles.manager}>
            {message && (
                <div
                    className={`${styles.message} ${success
                            ? styles.success
                            : styles.error
                        }`}
                >
                    {success ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <XCircle size={18} />
                    )}

                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Fechar mensagem"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className={styles.layout}>
                <section
                    className={styles.formCard}
                    id="formulario-categoria"
                >
                    <div className={styles.cardHeading}>
                        <span>
                            {editingId ? (
                                <Pencil size={21} />
                            ) : (
                                <Plus size={21} />
                            )}
                        </span>

                        <div>
                            <h2>
                                {editingId
                                    ? "Editar categoria"
                                    : "Nova categoria"}
                            </h2>

                            <p>
                                Preencha as informações da
                                categoria.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Nome da categoria</span>

                            <input
                                value={formData.name}
                                onChange={(event) =>
                                    updateField(
                                        "name",
                                        event.target.value,
                                    )
                                }
                                placeholder="Exemplo: Sistemas web"
                                minLength={2}
                                required
                            />
                        </label>

                        <label>
                            <span>Descrição</span>

                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    updateField(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                placeholder="Descrição opcional da categoria."
                                rows={4}
                                maxLength={500}
                            />

                            <small>
                                {formData.description.length}/500
                                caracteres
                            </small>
                        </label>

                        <label>
                            <span>Posição</span>

                            <input
                                type="number"
                                min={0}
                                value={formData.position}
                                onChange={(event) =>
                                    updateField(
                                        "position",
                                        Number(
                                            event.target.value,
                                        ),
                                    )
                                }
                            />
                        </label>

                        <button
                            className={`${styles.statusControl} ${formData.active
                                    ? styles.statusActive
                                    : ""
                                }`}
                            type="button"
                            onClick={() =>
                                updateField(
                                    "active",
                                    !formData.active,
                                )
                            }
                        >
                            <span>
                                {formData.active && (
                                    <Check size={14} />
                                )}
                            </span>

                            <div>
                                <strong>Categoria ativa</strong>
                                <small>
                                    Categorias ativas podem ser
                                    utilizadas nos projetos.
                                </small>
                            </div>
                        </button>

                        <div className={styles.formActions}>
                            {editingId && (
                                <button
                                    className={
                                        styles.cancelButton
                                    }
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    <X size={17} />
                                    Cancelar
                                </button>
                            )}

                            <button
                                className={styles.saveButton}
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <LoaderCircle
                                        className={styles.spin}
                                        size={18}
                                    />
                                ) : (
                                    <Save size={18} />
                                )}

                                {saving
                                    ? "Salvando..."
                                    : editingId
                                        ? "Atualizar"
                                        : "Cadastrar"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <div>
                            <span>
                                <FolderTree size={20} />
                            </span>

                            <div>
                                <h2>Categorias cadastradas</h2>
                                <p>
                                    {categories.length}{" "}
                                    {categories.length === 1
                                        ? "categoria"
                                        : "categorias"}
                                </p>
                            </div>
                        </div>

                        <label className={styles.search}>
                            <Search size={17} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Buscar categoria..."
                            />
                        </label>
                    </div>

                    {filteredCategories.length > 0 ? (
                        <div className={styles.categoryList}>
                            {filteredCategories.map(
                                (category) => (
                                    <article
                                        className={
                                            styles.categoryItem
                                        }
                                        key={category.id}
                                    >
                                        <div
                                            className={
                                                styles.categoryIcon
                                            }
                                        >
                                            <FolderTree size={20} />
                                        </div>

                                        <div
                                            className={
                                                styles.categoryInfo
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.categoryTitle
                                                }
                                            >
                                                <strong>
                                                    {category.name}
                                                </strong>

                                                <span
                                                    className={
                                                        category.active
                                                            ? styles.activeBadge
                                                            : styles.inactiveBadge
                                                    }
                                                >
                                                    {category.active
                                                        ? "Ativa"
                                                        : "Inativa"}
                                                </span>
                                            </div>

                                            <p>
                                                {category.description ||
                                                    "Sem descrição cadastrada."}
                                            </p>

                                            <div
                                                className={
                                                    styles.metadata
                                                }
                                            >
                                                <span>
                                                    Endereço:{" "}
                                                    <strong>
                                                        {
                                                            category.slug
                                                        }
                                                    </strong>
                                                </span>

                                                <span>
                                                    Posição:{" "}
                                                    <strong>
                                                        {
                                                            category.position
                                                        }
                                                    </strong>
                                                </span>

                                                <span>
                                                    Projetos:{" "}
                                                    <strong>
                                                        {
                                                            category.projectsCount
                                                        }
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                styles.itemActions
                                            }
                                        >
                                            <button
                                                className={
                                                    category.active
                                                        ? styles.disableButton
                                                        : styles.enableButton
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleStatus(
                                                        category,
                                                    )
                                                }
                                            >
                                                {category.active ? (
                                                    <XCircle
                                                        size={16}
                                                    />
                                                ) : (
                                                    <CheckCircle2
                                                        size={16}
                                                    />
                                                )}

                                                {category.active
                                                    ? "Desativar"
                                                    : "Ativar"}
                                            </button>

                                            <button
                                                className={
                                                    styles.editButton
                                                }
                                                type="button"
                                                onClick={() =>
                                                    startEditing(
                                                        category,
                                                    )
                                                }
                                            >
                                                <Pencil size={16} />
                                                Editar
                                            </button>

                                            <button
                                                className={
                                                    styles.deleteButton
                                                }
                                                type="button"
                                                onClick={() =>
                                                    deleteCategory(
                                                        category,
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    category.id
                                                }
                                                title={
                                                    category.projectsCount >
                                                        0
                                                        ? "Remova a categoria dos projetos antes de excluir"
                                                        : "Excluir categoria"
                                                }
                                            >
                                                {deletingId ===
                                                    category.id ? (
                                                    <LoaderCircle
                                                        className={
                                                            styles.spin
                                                        }
                                                        size={16}
                                                    />
                                                ) : (
                                                    <Trash2
                                                        size={16}
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </article>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <span>
                                <FolderTree size={28} />
                            </span>

                            <strong>
                                Nenhuma categoria encontrada
                            </strong>

                            <p>
                                Cadastre uma categoria ou altere
                                sua busca.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}