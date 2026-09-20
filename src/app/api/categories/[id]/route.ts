// src/app/api/categories/[id]/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import {
    NextRequest,
    NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CategoryRouteProps = {
    params: Promise<{
        id: string;
    }>;
};

function formatCategory(category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        projects: number;
    };
}) {
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        active: category.active,
        position: category.position,
        projectsCount: category._count.projects,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
    };
}

export async function PUT(
    request: NextRequest,
    { params }: CategoryRouteProps,
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
        const currentCategory =
            await prisma.category.findUnique({
                where: {
                    id,
                },
            });

        if (!currentCategory) {
            return NextResponse.json(
                {
                    message: "Categoria não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        const body = (await request.json()) as Record<
            string,
            unknown
        >;

        const name =
            typeof body.name === "string"
                ? body.name.trim()
                : currentCategory.name;

        const description =
            typeof body.description === "string"
                ? body.description.trim()
                : currentCategory.description || "";

        const active =
            typeof body.active === "boolean"
                ? body.active
                : currentCategory.active;

        const receivedPosition =
            body.position !== undefined
                ? Number(body.position)
                : currentCategory.position;

        const position = Number.isFinite(receivedPosition)
            ? Math.max(0, Math.trunc(receivedPosition))
            : currentCategory.position;

        if (name.length < 2) {
            return NextResponse.json(
                {
                    message:
                        "Informe um nome com pelo menos 2 caracteres.",
                },
                {
                    status: 400,
                },
            );
        }

        if (description.length > 500) {
            return NextResponse.json(
                {
                    message:
                        "A descrição deve possuir no máximo 500 caracteres.",
                },
                {
                    status: 400,
                },
            );
        }

        const slug = createSlug(name);

        const categoryWithSameSlug =
            await prisma.category.findFirst({
                where: {
                    slug,
                    id: {
                        not: id,
                    },
                },
                select: {
                    id: true,
                },
            });

        if (categoryWithSameSlug) {
            return NextResponse.json(
                {
                    message:
                        "Já existe outra categoria com esse nome.",
                },
                {
                    status: 409,
                },
            );
        }

        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
                slug,
                description: description || null,
                active,
                position,
            },
            include: {
                _count: {
                    select: {
                        projects: true,
                    },
                },
            },
        });

        return NextResponse.json({
            message: "Categoria atualizada com sucesso.",
            category: formatCategory(category),
        });
    } catch (error) {
        console.error(
            "Erro ao atualizar categoria:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Não foi possível atualizar a categoria.",
            },
            {
                status: 500,
            },
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: CategoryRouteProps,
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
        const category = await prisma.category.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        projects: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                {
                    message: "Categoria não encontrada.",
                },
                {
                    status: 404,
                },
            );
        }

        if (category._count.projects > 0) {
            return NextResponse.json(
                {
                    message: `A categoria "${category.name}" está sendo utilizada por ${category._count.projects} projeto(s). Remova-a dos projetos antes de excluir.`,
                },
                {
                    status: 409,
                },
            );
        }

        await prisma.category.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message: "Categoria excluída com sucesso.",
        });
    } catch (error) {
        console.error(
            "Erro ao excluir categoria:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Não foi possível excluir a categoria.",
            },
            {
                status: 500,
            },
        );
    }
}