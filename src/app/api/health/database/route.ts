// src/app/api/health/database/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            success: true,
            message: "Banco de dados conectado com sucesso.",
        });
    } catch (error) {
        console.error("Erro na conexão com o banco:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Não foi possível conectar ao banco de dados.",
            },
            {
                status: 500,
            },
        );
    }
}