// src/app/(admin)/admin/projetos/[id]/page.tsx

import ProjectForm from "@/components/admin/ProjectForm/ProjectForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type EditProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProjectPage({
    params,
}: EditProjectPageProps) {
    await requireAdmin();

    const { id } = await params;

    const [project, categories, technologies] = await Promise.all([
        prisma.project.findUnique({
            where: {
                id,
            },
            include: {
                images: {
                    orderBy: {
                        position: "asc",
                    },
                },
                technologies: {
                    select: {
                        technologyId: true,
                    },
                },
            },
        }),
        prisma.category.findMany({
            where: {
                active: true,
            },
            orderBy: [
                {
                    position: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
            },
        }),
        prisma.technology.findMany({
            where: {
                active: true,
            },
            orderBy: [
                {
                    position: "asc",
                },
                {
                    name: "asc",
                },
            ],
            select: {
                id: true,
                name: true,
                color: true,
            },
        }),
    ]);

    if (!project) {
        notFound();
    }

    return (
        <ProjectForm
            categories={categories}
            technologies={technologies}
            initialData={{
                id: project.id,
                title: project.title,
                shortDescription: project.shortDescription,
                description: project.description,
                type: project.type,
                status: project.status,
                projectUrl: project.projectUrl,
                githubUrl: project.githubUrl,
                coverImageUrl: project.coverImageUrl,
                coverPublicId: project.coverPublicId,
                featured: project.featured,
                position: project.position,
                categoryId: project.categoryId,
                technologyIds: project.technologies.map(
                    (technology) => technology.technologyId,
                ),
                images: project.images.map((image) => ({
                    imageUrl: image.imageUrl,
                    publicId: image.publicId,
                    altText: image.altText,
                    position: image.position,
                })),
            }}
        />
    );
}