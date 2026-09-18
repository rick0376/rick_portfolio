// src/app/api/cloudinary/delete/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_PUBLIC_ID_PATTERN =
    /^portfolio\/(capa|galeria)\/[a-zA-Z0-9_-]+$/;

export async function DELETE(
    request: NextRequest,
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

    try {
        const body = (await request.json()) as {
            publicId?: unknown;
        };

        const publicId = String(
            body.publicId ?? "",
        ).trim();

        if (!publicId) {
            return NextResponse.json(
                {
                    message:
                        "O identificador da imagem é obrigatório.",
                },
                {
                    status: 400,
                },
            );
        }

        if (
            !ALLOWED_PUBLIC_ID_PATTERN.test(
                publicId,
            )
        ) {
            return NextResponse.json(
                {
                    message:
                        "O identificador da imagem não é permitido.",
                },
                {
                    status: 400,
                },
            );
        }

        const result =
            await cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type: "image",
                    invalidate: true,
                },
            );

        if (
            !["ok", "not found"].includes(
                result.result,
            )
        ) {
            return NextResponse.json(
                {
                    message:
                        "Não foi possível excluir a imagem.",
                },
                {
                    status: 400,
                },
            );
        }

        return NextResponse.json({
            message:
                result.result === "not found"
                    ? "A imagem já não existia no Cloudinary."
                    : "Imagem excluída com sucesso.",
        });
    } catch (error) {
        console.error(
            "Erro ao excluir imagem:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Não foi possível excluir a imagem.",
            },
            {
                status: 500,
            },
        );
    }
}