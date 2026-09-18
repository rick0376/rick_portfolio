// src/app/api/settings/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nullableText(value: unknown) {
    const text = String(value ?? "").trim();
    return text || null;
}

function validOptionalUrl(value: string | null) {
    if (!value) {
        return true;
    }

    if (value.startsWith("/")) {
        return true;
    }

    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

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

    const settings = await prisma.siteSetting.findUnique({
        where: {
            id: "main",
        },
    });

    return NextResponse.json({
        settings,
    });
}

export async function PUT(request: NextRequest) {
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

        const professionalName = String(
            body.professionalName ?? "",
        ).trim();
        const brandName = String(body.brandName ?? "").trim();
        const email = nullableText(body.email);
        const linkedinUrl = nullableText(body.linkedinUrl);
        const githubUrl = nullableText(body.githubUrl);
        const curriculumUrl = nullableText(body.curriculumUrl);

        if (professionalName.length < 3) {
            return NextResponse.json(
                {
                    message: "Informe o nome profissional.",
                },
                {
                    status: 400,
                },
            );
        }

        if (brandName.length < 2) {
            return NextResponse.json(
                {
                    message: "Informe o nome da marca.",
                },
                {
                    status: 400,
                },
            );
        }

        if (email && !email.includes("@")) {
            return NextResponse.json(
                {
                    message: "Informe um e-mail válido.",
                },
                {
                    status: 400,
                },
            );
        }

        const urls = [
            { name: "LinkedIn", value: linkedinUrl },
            { name: "GitHub", value: githubUrl },
            { name: "currículo", value: curriculumUrl },
        ];

        const invalidUrl = urls.find(
            ({ value }) => !validOptionalUrl(value),
        );

        if (invalidUrl) {
            return NextResponse.json(
                {
                    message: `Informe um endereço válido para ${invalidUrl.name}.`,
                },
                {
                    status: 400,
                },
            );
        }

        const settings = await prisma.siteSetting.upsert({
            where: {
                id: "main",
            },
            update: {
                professionalName,
                brandName,
                headline: nullableText(body.headline),
                biography: nullableText(body.biography),
                email,
                phone: nullableText(body.phone),
                whatsapp: nullableText(body.whatsapp),
                location: nullableText(body.location),
                linkedinUrl,
                githubUrl,
                curriculumUrl,
                availabilityText: nullableText(
                    body.availabilityText,
                ),
            },
            create: {
                id: "main",
                professionalName,
                brandName,
                headline: nullableText(body.headline),
                biography: nullableText(body.biography),
                email,
                phone: nullableText(body.phone),
                whatsapp: nullableText(body.whatsapp),
                location: nullableText(body.location),
                linkedinUrl,
                githubUrl,
                curriculumUrl,
                availabilityText: nullableText(
                    body.availabilityText,
                ),
            },
        });

        return NextResponse.json({
            message: "Configurações atualizadas com sucesso.",
            settings,
        });
    } catch (error) {
        console.error("Erro ao atualizar configurações:", error);

        return NextResponse.json(
            {
                message: "Não foi possível salvar as configurações.",
            },
            {
                status: 500,
            },
        );
    }
}