// src/components/projects/ProjectCard/ProjectCard.tsx

import type { Project } from "@/types/project";
import {
  ArrowUpRight,
  BarChart3,
  CarFront,
  ImageIcon,
  RadioTower,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

type ProjectCardProps = {
  project: Project;
};

const projectIcons = {
  "rp-track": CarFront,
  "radio-manager": RadioTower,
  "dashboard-gestao": BarChart3,
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const Icon =
    projectIcons[project.slug as keyof typeof projectIcons] ?? ImageIcon;

  return (
    <article className={styles.card}>
      <Link
        className={styles.cardLink}
        href={`/projetos/${project.slug}`}
        aria-label={`Ver detalhes do projeto ${project.title}`}
      >
        <div className={`${styles.cover} ${styles[project.accent]}`}>
          {project.coverImageUrl ? (
            <Image
              className={styles.coverImage}
              src={project.coverImageUrl}
              alt={`Imagem de capa do projeto ${project.title}`}
              fill
              sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
            />
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.browserBar}>
                <i />
                <i />
                <i />
                <span>{project.status}</span>
              </div>

              <div className={styles.preview}>
                <div className={styles.previewSide}>
                  <Icon size={22} />
                  <span />
                  <span />
                  <span />
                </div>

                <div className={styles.previewMain}>
                  <div className={styles.previewTop}>
                    <span />
                    <span />
                  </div>

                  <div className={styles.previewChart}>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className={styles.previewCards}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.coverOverlay} />

          <span className={styles.status}>{project.status}</span>
          <span className={styles.category}>{project.category}</span>
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3>{project.title}</h3>

            <span className={styles.openButton}>
              <ArrowUpRight size={19} />
            </span>
          </div>

          <p>{project.summary}</p>

          <div className={styles.footer}>
            <div className={styles.tags}>
              {project.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <span className={styles.viewProject}>
              Ver projeto
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}