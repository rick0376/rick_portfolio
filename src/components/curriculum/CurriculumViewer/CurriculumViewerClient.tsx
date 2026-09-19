// src/components/curriculum/CurriculumViewer/CurriculumViewerClient.tsx

"use client";

import {
    Download,
    ExternalLink,
    FileText,
    Home,
    LoaderCircle,
    Maximize2,
    Minimize2,
    X,
} from "lucide-react";
import Link from "next/link";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    Document,
    Page,
    pdfjs,
} from "react-pdf";

import styles from "./styles.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

type CurriculumViewerProps = {
    curriculumUrl: string;
    professionalName: string;
};

export default function CurriculumViewerClient({
    curriculumUrl,
    professionalName,
}: CurriculumViewerProps) {
    const frameRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [pageWidth, setPageWidth] = useState(800);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = expanded
            ? "hidden"
            : "";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setExpanded(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [expanded]);

    useEffect(() => {
        const frame = frameRef.current;

        if (!frame) {
            return;
        }

        function updateWidth() {
            if (!frame) {
                return;
            }

            const availableWidth =
                frame.clientWidth -
                (window.innerWidth <= 560 ? 20 : 44);

            setPageWidth(
                Math.max(
                    260,
                    Math.min(availableWidth, 1120),
                ),
            );
        }

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(frame);

        window.addEventListener("resize", updateWidth);

        return () => {
            observer.disconnect();
            window.removeEventListener(
                "resize",
                updateWidth,
            );
        };
    }, [expanded]);

    const viewer = (
        <section
            className={`${styles.viewer} ${expanded ? styles.expanded : ""
                }`}
        >
            <div className={styles.toolbar}>
                <div className={styles.documentInfo}>
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
                        <Link
                            className={styles.homeButton}
                            href="/"
                        >
                            <Home size={17} />
                            <span>Início</span>
                        </Link>
                    )}

                    <button
                        className={`${styles.actionButton} ${expanded
                                ? styles.normalButton
                                : styles.expandButton
                            }`}
                        type="button"
                        onClick={() =>
                            setExpanded((current) => !current)
                        }
                    >
                        {expanded ? (
                            <>
                                <Minimize2 size={17} />
                                <span>Tela normal</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 size={17} />
                                <span>Ampliar</span>
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
                        <span>Abrir PDF</span>
                    </a>

                    <a
                        className={styles.downloadButton}
                        href={curriculumUrl}
                        download
                    >
                        <Download size={17} />
                        <span>Baixar currículo</span>
                    </a>

                    {expanded && (
                        <button
                            className={styles.closeButton}
                            type="button"
                            onClick={() => setExpanded(false)}
                            aria-label="Fechar visualização ampliada"
                            title="Fechar visualização"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.frame} ref={frameRef}>
                <Document
                    className={styles.pdfDocument}
                    file={curriculumUrl}
                    onLoadSuccess={({ numPages: total }) =>
                        setNumPages(total)
                    }
                    loading={
                        <div className={styles.loading}>
                            <LoaderCircle size={31} />
                            <strong>
                                Carregando currículo...
                            </strong>
                        </div>
                    }
                    error={
                        <div className={styles.error}>
                            <FileText size={34} />

                            <strong>
                                Não foi possível carregar o currículo
                            </strong>

                            <p>
                                Abra o documento em uma nova janela.
                            </p>

                            <a
                                href={curriculumUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir currículo
                                <ExternalLink size={17} />
                            </a>
                        </div>
                    }
                >
                    {Array.from(
                        { length: numPages },
                        (_, index) => (
                            <div
                                className={styles.pdfPage}
                                key={`page-${index + 1}`}
                            >
                                <Page
                                    pageNumber={index + 1}
                                    width={pageWidth}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={
                                        <div
                                            className={
                                                styles.pageLoading
                                            }
                                        >
                                            Carregando página...
                                        </div>
                                    }
                                />
                            </div>
                        ),
                    )}
                </Document>
            </div>
        </section>
    );

    if (expanded && mounted) {
        return createPortal(viewer, document.body);
    }

    return viewer;
}