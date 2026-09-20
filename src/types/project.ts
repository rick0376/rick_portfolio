// src/types/project.ts

export type ProjectAccent =
  | "blue"
  | "cyan"
  | "violet";

export type ProjectType =
  | "NEXT_JS"
  | "REACT_NATIVE"
  | "POWER_BI"
  | "WEBSITE"
  | "DASHBOARD"
  | "MOBILE"
  | "OTHER";

export type ProjectImage = {
  id: string;
  imageUrl: string;
  publicId: string;
  altText: string | null;
  position: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  category: string;
  technologies: string[];
  accent: ProjectAccent;
  status: string;
  type?: ProjectType;
  featured?: boolean;
  coverImageUrl: string | null;
  coverImagePublicId?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  images?: ProjectImage[];
};