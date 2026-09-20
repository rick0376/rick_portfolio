// src/components/home/FeaturedProjects/ProjectCarousel.tsx

"use client";

import ProjectCard from "@/components/projects/ProjectCard/ProjectCard";
import type { Project } from "@/types/project";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import styles from "./styles.module.scss";

type ProjectCarouselProps = {
    projects: Project[];
};

export default function ProjectCarousel({
    projects,
}: ProjectCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] =
        useState(false);

    const [canScrollRight, setCanScrollRight] =
        useState(projects.length > 1);

    const updateScrollButtons = useCallback(() => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const maximumScroll =
            carousel.scrollWidth - carousel.clientWidth;

        setCanScrollLeft(carousel.scrollLeft > 8);

        setCanScrollRight(
            carousel.scrollLeft < maximumScroll - 8,
        );
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        updateScrollButtons();

        carousel.addEventListener(
            "scroll",
            updateScrollButtons,
            {
                passive: true,
            },
        );

        window.addEventListener(
            "resize",
            updateScrollButtons,
        );

        return () => {
            carousel.removeEventListener(
                "scroll",
                updateScrollButtons,
            );

            window.removeEventListener(
                "resize",
                updateScrollButtons,
            );
        };
    }, [updateScrollButtons]);

    function scrollCarousel(direction: "left" | "right") {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const firstCard =
            carousel.querySelector<HTMLElement>(
                `.${styles.slide}`,
            );

        const cardWidth =
            firstCard?.getBoundingClientRect().width ||
            carousel.clientWidth * 0.8;

        const gap = 21;
        const distance = cardWidth + gap;

        carousel.scrollBy({
            left:
                direction === "right"
                    ? distance
                    : -distance,
            behavior: "smooth",
        });
    }

    return (
        <div className={styles.carouselWrapper}>
            {projects.length > 1 && (
                <>
                    <button
                        className={`${styles.arrowButton} ${styles.previousButton}`}
                        type="button"
                        onClick={() =>
                            scrollCarousel("left")
                        }
                        disabled={!canScrollLeft}
                        aria-label="Ver projetos anteriores"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className={`${styles.arrowButton} ${styles.nextButton}`}
                        type="button"
                        onClick={() =>
                            scrollCarousel("right")
                        }
                        disabled={!canScrollRight}
                        aria-label="Ver próximos projetos"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            <div
                className={styles.carousel}
                ref={carouselRef}
            >
                {projects.map((project) => (
                    <div
                        className={styles.slide}
                        key={project.id}
                    >
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>

            {projects.length > 1 && (
                <div className={styles.scrollHint}>
                    <span />
                </div>
            )}
        </div>
    );
}