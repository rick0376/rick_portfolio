// src/app/(admin)/admin/categorias/page.tsx

import CategoryManager from "@/components/admin/CategoryManager/CategoryManager";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FolderTree, Plus } from "lucide-react";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    await requireAdmin();

    const categories = await prisma.category.findMany({
        orderBy: [
            {
                position: "asc",
            },
            {
                name: "asc",
            },
        ],
        include: {
            _count: {
                select: {
                    projects: true,
                },
            },
        },
    });

    const formattedCategories = categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: category.active,
        position: category.position,
        projectsCount: category._count.projects,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
    }));

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.heroGlow} />

                <div>
                    <span className={styles.eyebrow}>
                        <FolderTree size={14} />
                        Organização do portfólio
                    </span>

                    <h1>Categorias</h1>

                    <p>
                        Cadastre e organize as categorias utilizadas na
                        classificação dos projetos.
                    </p>
                </div>

                <a href="#formulario-categoria">
                    <Plus size={18} />
                    Nova categoria
                </a>
            </header>

            <CategoryManager
                initialCategories={formattedCategories}
            />
        </div>
    );
}