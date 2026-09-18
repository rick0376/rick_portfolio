// src/app/api/projects/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { validateProjectInput } from "@/validations/project.schema";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
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

    try {
        const projects = await prisma.project.findMany({
            orderBy: [
                {
                    position: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
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

        return NextResponse.json({
            projects,
        });
    } catch (error) {
        console.error("Erro ao buscar projetos:", error);

        return NextResponse.json(
            {
                message: "Não foi possível buscar os projetos.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(request: NextRequest) {
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

    try {
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

        const existingProject = await prisma.project.findUnique({
            where: {
                slug: data.slug,
            },
            select: {
                id: true,
            },
        });

        if (existingProject) {
            return NextResponse.json(
                {
                    message:
                        "Já existe um projeto com esse título ou endereço.",
                },
                {
                    status: 409,
                },
            );
        }

        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: {
                    id: data.categoryId,
                },
                select: {
                    id: true,
                },
            });

            if (!category) {
                return NextResponse.json(
                    {
                        message: "A categoria selecionada não existe.",
                    },
                    {
                        status: 400,
                    },
                );
            }
        }

        if (data.technologyIds.length > 0) {
            const technologiesCount = await prisma.technology.count({
                where: {
                    id: {
                        in: data.technologyIds,
                    },
                },
            });

            if (technologiesCount !== data.technologyIds.length) {
                return NextResponse.json(
                    {
                        message:
                            "Uma ou mais tecnologias selecionadas não existem.",
                    },
                    {
                        status: 400,
                    },
                );
            }
        }

        const project = await prisma.project.create({
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
                    data.status === "PUBLISHED" ? new Date() : null,
                images: {
                    create: data.images.map((image) => ({
                        imageUrl: image.imageUrl,
                        publicId: image.publicId,
                        altText: image.altText,
                        position: image.position,
                    })),
                },
                technologies: {
                    create: data.technologyIds.map((technologyId) => ({
                        technologyId,
                    })),
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

        return NextResponse.json(
            {
                message: "Projeto criado com sucesso.",
                project,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Erro ao criar projeto:", error);

        return NextResponse.json(
            {
                message: "Não foi possível criar o projeto.",
            },
            {
                status: 500,
            },
        );
    }
}