// src/app/(site)/curriculo/page.tsx

import CurriculumViewer from "@/components/curriculum/CurriculumViewer/CurriculumViewer";
import { getSiteSettings } from "@/lib/site-settings";
import { ArrowLeft, FileText } from "lucide-react";
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
                    <div className={styles.headerContent}>
                        <Link className={styles.backButton} href="/">
                            <ArrowLeft size={17} />
                            <span>Voltar ao portfólio</span>
                        </Link>

                        <div className={styles.heading}>
                            <span className={styles.icon}>
                                <FileText size={23} />
                            </span>

                            <div className={styles.headingText}>
                                <span className={styles.eyebrow}>
                                    Currículo profissional
                                </span>

                                <h1>{settings.professionalName}</h1>

                                <p>
                                    Experiências, formações, competências e
                                    conhecimentos profissionais.
                                </p>
                            </div>
                        </div>

                        <span className={styles.status}>
                            <i />
                            Documento atualizado
                        </span>
                    </div>
                </div>
            </section>

            <section className={styles.viewerSection}>
                <div className={styles.container}>
                    <CurriculumViewer
                        curriculumUrl={curriculumUrl}
                        professionalName={settings.professionalName}
                    />
                </div>
            </section>
        </main>
    );
}