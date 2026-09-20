// src/app/api/categories/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import {
    NextRequest,
    NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        const body = (await request.json()) as Record<
            string,
            unknown
        >;

        const name = String(body.name || "").trim();
        const description = String(
            body.description || "",
        ).trim();

        const positionValue = Number(body.position);
        const position = Number.isFinite(positionValue)
            ? Math.max(0, Math.trunc(positionValue))
            : 0;

        const active =
            typeof body.active === "boolean"
                ? body.active
                : true;

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

        const existingCategory =
            await prisma.category.findUnique({
                where: {
                    slug,
                },
                select: {
                    id: true,
                },
            });

        if (existingCategory) {
            return NextResponse.json(
                {
                    message:
                        "Já existe uma categoria com esse nome.",
                },
                {
                    status: 409,
                },
            );
        }

        const category = await prisma.category.create({
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

        return NextResponse.json(
            {
                message: "Categoria cadastrada com sucesso.",
                category: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    active: category.active,
                    position: category.position,
                    projectsCount: category._count.projects,
                    createdAt:
                        category.createdAt.toISOString(),
                    updatedAt:
                        category.updatedAt.toISOString(),
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "Erro ao cadastrar categoria:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Não foi possível cadastrar a categoria.",
            },
            {
                status: 500,
            },
        );
    }
}