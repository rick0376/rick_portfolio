// src/app/api/cloudinary/upload/route.ts

import { getCurrentAdmin } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];

const ALLOWED_FOLDERS = [
    "portfolio/capa",
    "portfolio/galeria",
];

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
        const formData = await request.formData();

        const file = formData.get("file");

        const folder = String(
            formData.get("folder") ?? "",
        ).trim();

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    message: "Selecione uma imagem.",
                },
                {
                    status: 400,
                },
            );
        }

        if (!ALLOWED_FOLDERS.includes(folder)) {
            return NextResponse.json(
                {
                    message:
                        "A pasta informada para a imagem é inválida.",
                },
                {
                    status: 400,
                },
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                {
                    message:
                        "Formato inválido. Utilize JPG, PNG, WEBP ou AVIF.",
                },
                {
                    status: 400,
                },
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    message:
                        "A imagem deve possuir no máximo 10 MB.",
                },
                {
                    status: 400,
                },
            );
        }

        const fileBuffer = Buffer.from(
            await file.arrayBuffer(),
        );

        const base64File =
            fileBuffer.toString("base64");

        const dataUri =
            `data:${file.type};base64,${base64File}`;

        const result =
            await cloudinary.uploader.upload(
                dataUri,
                {
                    folder,
                    resource_type: "image",
                    quality: "auto",
                    fetch_format: "auto",
                    use_filename: true,
                    unique_filename: true,
                    overwrite: false,
                },
            );

        return NextResponse.json(
            {
                message:
                    "Imagem enviada com sucesso.",
                image: {
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            "Erro no upload do Cloudinary:",
            error,
        );

        return NextResponse.json(
            {
                message:
                    "Não foi possível enviar a imagem.",
            },
            {
                status: 500,
            },
        );
    }
}