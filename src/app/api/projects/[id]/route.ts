// src/app/api/projects/[id]/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { validateProjectInput } from "@/validations/project.schema";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProjectRouteProps = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: NextRequest,
    { params }: ProjectRouteProps,
) {
    const admin = await getCurrentAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                message: "Não autorizado.",
            },
            {
                status: 401,
            },
        );
    }

    const { id } = await params;

    try {
        const project = await prisma.project.findUnique({
            where: {
                id,
            },
            include: {
                category: true,
                images: {
                    orderBy: {
                        position: "asc",
                    },
                },
                technologies: {
                    include: {
                        technology: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    message: "Projeto não encontrado.",
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json({
            project,
        });
    } catch (error) {
        console.error("Erro ao buscar projeto:", error);

        return NextResponse.json(
            {
                message: "Não foi possível buscar o projeto.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: ProjectRouteProps,
) {
    const admin = await getCurrentAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                message: "Não autorizado.",
            },
            {
                status: 401,
            },
        );
    }

    const { id } = await params;

    try {
        const currentProject = await prisma.project.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                publishedAt: true,
            },
        });

        if (!currentProject) {
            return NextResponse.json(
                {
                    message: "Projeto não encontrado.",
                },
                {
                    status: 404,
                },
            );
        }

        const body = (await request.json()) as Record<string, unknown>;

        const generatedSlug = createSlug(
            String(body.slug || body.title || ""),
        );

        const validation = validateProjectInput({
            ...body,
            slug: generatedSlug,
        });

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.message,
                },
                {
                    status: 400,
                },
            );
        }

        const data = validation.data;

        const projectWithSameSlug = await prisma.project.findFirst({
            where: {
                slug: data.slug,
                id: {
                    not: id,
                },
            },
            select: {
                id: true,
            },
        });

        if (projectWithSameSlug) {
            return NextResponse.json(
                {
                    message:
                        "Já existe outro projeto com esse título ou endereço.",
                },
                {
                    status: 409,
                },
            );
        }

        const project = await prisma.$transaction(
            async (transaction) => {
                await transaction.projectTechnology.deleteMany({
                    where: {
                        projectId: id,
                    },
                });

                await transaction.projectImage.deleteMany({
                    where: {
                        projectId: id,
                    },
                });

                return transaction.project.update({
                    where: {
                        id,
                    },
                    data: {
                        title: data.title,
                        slug: data.slug,
                        shortDescription: data.shortDescription,
                        description: data.description,
                        type: data.type,
                        status: data.status,
                        projectUrl: data.projectUrl,
                        githubUrl: data.githubUrl,
                        coverImageUrl: data.coverImageUrl,
                        coverPublicId: data.coverPublicId,
                        featured: data.featured,
                        position: data.position,
                        categoryId: data.categoryId,
                        publishedAt:
                            data.status === "PUBLISHED"
                                ? currentProject.publishedAt || new Date()
                                : null,
                        images: {
                            create: data.images.map((image) => ({
                                imageUrl: image.imageUrl,
                                publicId: image.publicId,
                                altText: image.altText,
                                position: image.position,
                            })),
                        },
                        technologies: {
                            create: data.technologyIds.map(
                                (technologyId) => ({
                                    technologyId,
                                }),
                            ),
                        },
                    },
                    include: {
                        category: true,
                        images: {
                            orderBy: {
                                position: "asc",
                            },
                        },
                        technologies: {
                            include: {
                                technology: true,
                            },
                        },
                    },
                });
            },
        );

        return NextResponse.json({
            message: "Projeto atualizado com sucesso.",
            project,
        });
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);

        return NextResponse.json(
            {
                message: "Não foi possível atualizar o projeto.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: ProjectRouteProps,
) {
    const admin = await getCurrentAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                message: "Não autorizado.",
            },
            {
                status: 401,
            },
        );
    }

    const { id } = await params;

    try {
        const project = await prisma.project.findUnique({
            where: {
                id,
            },
            select: {
                coverPublicId: true,
                images: {
                    select: {
                        publicId: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                {
                    message: "Projeto não encontrado.",
                },
                {
                    status: 404,
                },
            );
        }

        const publicIds = [
            project.coverPublicId,
            ...project.images.map((image) => image.publicId),
        ].filter((publicId): publicId is string => Boolean(publicId));

        await prisma.project.delete({
            where: {
                id,
            },
        });

        await Promise.allSettled(
            [...new Set(publicIds)].map((publicId) =>
                cloudinary.uploader.destroy(publicId, {
                    resource_type: "image",
                    invalidate: true,
                }),
            ),
        );

        return NextResponse.json({
            message: "Projeto excluído com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao excluir projeto:", error);

        return NextResponse.json(
            {
                message: "Não foi possível excluir o projeto.",
            },
            {
                status: 500,
            },
        );
    }
}