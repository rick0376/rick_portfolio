// src/app/(site)/curriculo/page.tsx

import CurriculumViewer from "@/components/curriculum/CurriculumViewer/CurriculumViewer";
import { getSiteSettings } from "@/lib/site-settings";
import {
    ArrowLeft,
    Download,
    FileText,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Currículo profissional",
    description:
        "Currículo profissional de Luis Henrique Pereira, com experiências, formações e competências.",
};

export default async function CurriculumPage() {
    const settings = await getSiteSettings();

    const curriculumUrl =
        settings.curriculumUrl ||
        "/curriculo/curriculo-luis-henrique-pereira.pdf";

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <div className={styles.grid} />
                <div className={styles.glow} />

                <div className={styles.container}>
                    <div className={styles.navigation}>
                        <Link href="/">
                            <ArrowLeft size={17} />
                            Voltar ao portfólio
                        </Link>

                        <a href={curriculumUrl} download>
                            <Download size={17} />
                            Baixar PDF
                        </a>
                    </div>

                    <div className={styles.heading}>
                        <span className={styles.icon}>
                            <FileText size={25} />
                        </span>

                        <div>
                            <span className={styles.eyebrow}>
                                CURRÍCULO PROFISSIONAL
                            </span>

                            <h1>
                                {settings.professionalName}
                            </h1>

                            <p>
                                Experiências, formações,
                                competências e conhecimentos
                                profissionais.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.viewerSection}>
                <div className={styles.container}>
                    <CurriculumViewer
                        curriculumUrl={curriculumUrl}
                        professionalName={
                            settings.professionalName
                        }
                    />
                </div>
            </section>
        </main>
    );
}