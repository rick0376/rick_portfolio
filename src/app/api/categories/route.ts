// src/app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";

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

    return NextResponse.json({
        categories,
    });
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
        const body = await request.json();

        const name = String(body.name ?? "").trim();
        const description = String(
            body.description ?? "",
        ).trim();
        const active = body.active !== false;
        const position = Number(body.position ?? 0);

        if (name.length < 2) {
            return NextResponse.json(
                {
                    message:
                        "O nome deve possuir pelo menos 2 caracteres.",
                },
                {
                    status: 400,
                },
            );
        }

        const slug = createSlug(name);

        if (!slug) {
            return NextResponse.json(
                {
                    message: "Não foi possível gerar o slug.",
                },
                {
                    status: 400,
                },
            );
        }

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
                position: Number.isFinite(position)
                    ? position
                    : 0,
            },
        });

        return NextResponse.json(
            {
                message: "Categoria criada com sucesso.",
                category,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Erro ao criar categoria:", error);

        return NextResponse.json(
            {
                message: "Não foi possível criar a categoria.",
            },
            {
                status: 500,
            },
        );
    }
}