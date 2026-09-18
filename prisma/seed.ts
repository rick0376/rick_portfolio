// prisma/seed.ts

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

function getRequiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`A variável ${name} não foi configurada.`);
    }

    return value;
}

const databaseUrl = getRequiredEnv("DATABASE_URL");
const adminName = getRequiredEnv("ADMIN_NAME");
const adminEmail = getRequiredEnv("ADMIN_EMAIL").toLowerCase().trim();
const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

const adapter = new PrismaPg({
    connectionString: databaseUrl,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const passwordHash = await hash(adminPassword, 12);

    await prisma.adminUser.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            name: adminName,
            passwordHash,
            active: true,
        },
        create: {
            name: adminName,
            email: adminEmail,
            passwordHash,
            active: true,
        },
    });

    await prisma.siteSetting.upsert({
        where: {
            id: "main",
        },
        update: {},
        create: {
            id: "main",
            professionalName: "Luis Henrique Pereira",
            brandName: "Rick Pereira",
            headline: "Desenvolvimento de sistemas, aplicativos e dashboards",
        },
    });

    console.log("Administrador e configurações iniciais criados com sucesso.");
}

main()
    .catch((error) => {
        console.error("Erro ao executar o seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });