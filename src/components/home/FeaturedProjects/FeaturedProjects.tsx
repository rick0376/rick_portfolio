// src/components/home/FeaturedProjects/FeaturedProjects.tsx

import ProjectCarousel from "@/components/home/FeaturedProjects/ProjectCarousel";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import { prisma } from "@/lib/prisma";
import type {
  Project,
  ProjectAccent,
  ProjectType,
} from "@/types/project";
import {
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import styles from "./styles.module.scss";

function getProjectAccent(
  type: string,
): ProjectAccent {
  if (
    type === "REACT_NATIVE" ||
    type === "MOBILE"
  ) {
    return "cyan";
  }

  if (
    type === "POWER_BI" ||
    type === "DASHBOARD"
  ) {
    return "violet";
  }

  return "blue";
}

function getProjectTypeLabel(type: string) {
  const labels: Record<string, string> = {
    NEXT_JS: "Sistema web",
    REACT_NATIVE: "Aplicativo mobile",
    POWER_BI: "Power BI",
    WEBSITE: "Website",
    DASHBOARD: "Dashboard",
    MOBILE: "Aplicativo mobile",
    OTHER: "Projeto",
  };

  return labels[type] || "Projeto";
}

export default async function FeaturedProjects() {
  await connection();

  const databaseProjects =
    await prisma.project.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          position: "asc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        category: {
          select: {
            name: true,
          },
        },
        technologies: {
          include: {
            technology: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

  const projects: Project[] =
    databaseProjects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      summary: project.shortDescription,
      description: project.description,
      category:
        project.category?.name ||
        getProjectTypeLabel(project.type),
      technologies:
        project.technologies.map(
          ({ technology }) =>
            technology.name,
        ),
      accent: getProjectAccent(project.type),
      status: getProjectTypeLabel(project.type),
      type: project.type as ProjectType,
      featured: project.featured,
      coverImageUrl:
        project.coverImageUrl,
      coverImagePublicId:
        project.coverPublicId,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl,
    }));

  return (
    <section
      className={styles.section}
      id="projetos"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionHeading
            eyebrow="Projetos em destaque"
            title="Soluções criadas para problemas reais."
            description="Conheça sistemas, sites, aplicativos e dashboards desenvolvidos para unir tecnologia, organização e experiência de negócio."
          />

          <Link href="/projetos">
            Ver todos os projetos
            <ArrowRight size={17} />
          </Link>
        </div>

        {projects.length > 0 ? (
          <ProjectCarousel projects={projects} />
        ) : (
          <div className={styles.empty}>
            <span>
              <FolderOpen size={29} />
            </span>

            <h3>
              Os projetos estão sendo preparados
            </h3>

            <p>
              Em breve novos sistemas,
              aplicativos e dashboards serão
              apresentados aqui.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}