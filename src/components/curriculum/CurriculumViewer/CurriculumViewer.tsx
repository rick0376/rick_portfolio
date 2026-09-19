"use client";

import {
    Download,
    ExternalLink,
    FileText,
    Home,
    Maximize2,
    Minimize2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./styles.module.scss";

type CurriculumViewerProps = {
    curriculumUrl: string;
    professionalName: string;
};

export default function CurriculumViewer({
    curriculumUrl,
    professionalName,
}: CurriculumViewerProps) {
    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = expanded ? "hidden" : "";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setExpanded(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [expanded]);

    const viewer = (
        <section
            className={`${styles.viewer} ${expanded ? styles.expanded : ""
                }`}
        >
            <div className={styles.toolbar}>
                <div className={styles.document}>
                    <span className={styles.documentIcon}>
                        <FileText size={21} />
                    </span>

                    <div>
                        <strong>Currículo profissional</strong>
                        <small>{professionalName}</small>
                    </div>
                </div>

                <div className={styles.actions}>
                    {expanded && (
                        <Link className={styles.homeButton} href="/">
                            <Home size={17} />
                            Início
                        </Link>
                    )}

                    <button
                        className={`${styles.actionButton} ${styles.expandButton
                            } ${expanded ? styles.closeButton : ""}`}
                        type="button"
                        onClick={() => setExpanded((current) => !current)}
                    >
                        {expanded ? (
                            <>
                                <Minimize2 size={17} />
                                Tela normal
                            </>
                        ) : (
                            <>
                                <Maximize2 size={17} />
                                Ampliar
                            </>
                        )}
                    </button>

                    <a
                        className={`${styles.actionButton} ${styles.openButton}`}
                        href={curriculumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ExternalLink size={17} />
                        Abrir PDF
                    </a>

                    <a
                        className={`${styles.actionButton} ${styles.downloadButton}`}
                        href={curriculumUrl}
                        download
                    >
                        <Download size={17} />
                        Baixar currículo
                    </a>

                    {expanded && (
                        <button
                            className={styles.iconCloseButton}
                            type="button"
                            onClick={() => setExpanded(false)}
                            aria-label="Fechar visualização ampliada"
                            title="Fechar ampliação"
                        >
                            <X size={21} />
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.frame}>
                <iframe
                    src={`${curriculumUrl}#toolbar=0&navpanes=0&view=FitH`}
                    title={`Currículo de ${professionalName}`}
                />

            </div>
        </section>
    );

    if (expanded && mounted) {
        return createPortal(viewer, document.body);
    }

    return viewer;
}