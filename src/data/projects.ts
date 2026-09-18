// src/data/projects.ts

import type { Project } from "@/types/project";

export const featuredProjects: Project[] = [
  {
    id: "rp-track",
    slug: "rp-track",
    title: "RP Track",
    summary:
      "Plataforma completa para rastreamento, controle e gestão inteligente de frotas.",
    category: "Next.js",
    technologies: ["Next.js", "PostgreSQL", "Prisma"],
    accent: "blue",
    status: "Sistema web",
    coverImageUrl: null,
    projectUrl: null,
    githubUrl: null,
  },
  {
    id: "radio-manager",
    slug: "radio-manager",
    title: "Radio Manager",
    summary:
      "Gestão de programação, biblioteca de mídia e operação de rádio em um só lugar.",
    category: "Next.js",
    technologies: ["Next.js", "Cloudinary", "Neon"],
    accent: "cyan",
    status: "Sistema SaaS",
    coverImageUrl: null,
    projectUrl: null,
    githubUrl: null,
  },
  {
    id: "dashboard-gestao",
    slug: "dashboard-gestao",
    title: "Dashboard de Gestão",
    summary:
      "Indicadores claros e relatórios visuais para decisões rápidas e seguras.",
    category: "Power BI",
    technologies: ["Power BI", "DAX", "Excel"],
    accent: "violet",
    status: "Business intelligence",
    coverImageUrl: null,
    projectUrl: null,
    githubUrl: null,
  },
];