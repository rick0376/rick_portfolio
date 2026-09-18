// src/app/(admin)/admin/configuracoes/page.tsx

import SettingsForm from "@/components/admin/SettingsForm/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    await requireAdmin();

    const settings = await prisma.siteSetting.findUnique({
        where: {
            id: "main",
        },
    });

    return (
        <main className={styles.page}>
            <SettingsForm
                initialData={{
                    professionalName:
                        settings?.professionalName ??
                        "Luis Henrique Pereira",
                    brandName: settings?.brandName ?? "Rick Pereira",
                    headline:
                        settings?.headline ??
                        "Portfólio, Currículo e Projetos",
                    biography:
                        settings?.biography ??
                        "Desenvolvo sistemas, aplicativos e dashboards que unem tecnologia, organização e visão de negócio.",
                    email:
                        settings?.email ?? "contato@rickpereira.dev",
                    phone: settings?.phone ?? "",
                    whatsapp: settings?.whatsapp ?? "",
                    location: settings?.location ?? "Brasil",
                    linkedinUrl: settings?.linkedinUrl ?? "",
                    githubUrl: settings?.githubUrl ?? "",
                    curriculumUrl:
                        settings?.curriculumUrl ?? "/curriculo.pdf",
                    availabilityText:
                        settings?.availabilityText ??
                        "Disponível para novos projetos",
                }}
            />
        </main>
    );
}