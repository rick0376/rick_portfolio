// src/lib/site-settings.ts

import { cache } from "react";

import { prisma } from "@/lib/prisma";

export type PublicSiteSettings = {
    professionalName: string;
    brandName: string;
    headline: string | null;
    biography: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    location: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    curriculumUrl: string | null;
    availabilityText: string | null;
};

export const defaultSiteSettings: PublicSiteSettings = {
    professionalName: "Luis Henrique Pereira",
    brandName: "Rick Pereira",
    headline: "Portfólio, Currículo e Projetos",
    biography:
        "Desenvolvo sistemas, aplicativos e dashboards que unem tecnologia, organização e visão de negócio.",
    email: "contato@rickpereira.dev",
    phone: null,
    whatsapp: null,
    location: "Brasil",
    linkedinUrl: null,
    githubUrl: null,
    curriculumUrl: "/curriculo.pdf",
    availabilityText: "Disponível para novos projetos",
};

export const getSiteSettings = cache(
    async (): Promise<PublicSiteSettings> => {
        try {
            const settings = await prisma.siteSetting.findUnique({
                where: {
                    id: "main",
                },
                select: {
                    professionalName: true,
                    brandName: true,
                    headline: true,
                    biography: true,
                    email: true,
                    phone: true,
                    whatsapp: true,
                    location: true,
                    linkedinUrl: true,
                    githubUrl: true,
                    curriculumUrl: true,
                    availabilityText: true,
                },
            });

            return settings ?? defaultSiteSettings;
        } catch (error) {
            console.error("Erro ao carregar configurações do site:", error);
            return defaultSiteSettings;
        }
    },
);

export function createWhatsAppUrl(whatsapp?: string | null) {
    if (!whatsapp) {
        return null;
    }

    const number = whatsapp.replace(/\D/g, "");

    if (!number) {
        return null;
    }

    return `https://wa.me/${number}`;
}

export function getSocialDisplayValue(url?: string | null) {
    if (!url) {
        return "";
    }

    return url
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/$/, "");
}