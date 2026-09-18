// src/validations/project.schema.ts

const PROJECT_TYPES = [
    "NEXT_JS",
    "REACT_NATIVE",
    "POWER_BI",
    "WEBSITE",
    "DASHBOARD",
    "MOBILE",
    "OTHER",
] as const;

const PROJECT_STATUS = [
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
] as const;

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number];
export type ProjectStatusValue = (typeof PROJECT_STATUS)[number];

export type ProjectImageInput = {
    imageUrl: string;
    publicId: string;
    altText: string | null;
    position: number;
};

export type ProjectInput = {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    type: ProjectTypeValue;
    status: ProjectStatusValue;
    projectUrl: string | null;
    githubUrl: string | null;
    coverImageUrl: string | null;
    coverPublicId: string | null;
    featured: boolean;
    position: number;
    categoryId: string | null;
    technologyIds: string[];
    images: ProjectImageInput[];
};

type ValidationResult =
    | {
        success: true;
        data: ProjectInput;
    }
    | {
        success: false;
        message: string;
    };

function normalizeOptionalText(value: unknown) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue || null;
}

function normalizeUrl(value: unknown) {
    const normalizedValue = normalizeOptionalText(value);

    if (!normalizedValue) {
        return null;
    }

    try {
        const url = new URL(normalizedValue);

        if (!["http:", "https:"].includes(url.protocol)) {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}

export function validateProjectInput(body: unknown): ValidationResult {
    if (!body || typeof body !== "object") {
        return {
            success: false,
            message: "Os dados do projeto são inválidos.",
        };
    }

    const input = body as Record<string, unknown>;

    const title = String(input.title ?? "").trim();
    const slug = String(input.slug ?? "").trim();
    const shortDescription = String(
        input.shortDescription ?? "",
    ).trim();
    const description = String(input.description ?? "").trim();
    const type = String(input.type ?? "") as ProjectTypeValue;
    const status = String(
        input.status ?? "DRAFT",
    ) as ProjectStatusValue;

    if (title.length < 2) {
        return {
            success: false,
            message: "Informe um título com pelo menos 2 caracteres.",
        };
    }

    if (!slug) {
        return {
            success: false,
            message: "Não foi possível gerar o endereço do projeto.",
        };
    }

    if (shortDescription.length < 10) {
        return {
            success: false,
            message: "A descrição curta deve possuir pelo menos 10 caracteres.",
        };
    }

    if (description.length < 20) {
        return {
            success: false,
            message: "A descrição completa deve possuir pelo menos 20 caracteres.",
        };
    }

    if (!PROJECT_TYPES.includes(type)) {
        return {
            success: false,
            message: "Selecione um tipo de projeto válido.",
        };
    }

    if (!PROJECT_STATUS.includes(status)) {
        return {
            success: false,
            message: "Selecione um status válido.",
        };
    }

    const projectUrlValue = normalizeOptionalText(input.projectUrl);
    const githubUrlValue = normalizeOptionalText(input.githubUrl);

    const projectUrl = normalizeUrl(input.projectUrl);
    const githubUrl = normalizeUrl(input.githubUrl);

    if (projectUrlValue && !projectUrl) {
        return {
            success: false,
            message: "O link do projeto é inválido.",
        };
    }

    if (githubUrlValue && !githubUrl) {
        return {
            success: false,
            message: "O link do GitHub é inválido.",
        };
    }

    const technologyIds = Array.isArray(input.technologyIds)
        ? input.technologyIds
            .map((technologyId) => String(technologyId).trim())
            .filter(Boolean)
        : [];

    const images = Array.isArray(input.images)
        ? input.images
            .map((image, index) => {
                const currentImage = image as Record<string, unknown>;

                return {
                    imageUrl: String(currentImage.imageUrl ?? "").trim(),
                    publicId: String(currentImage.publicId ?? "").trim(),
                    altText:
                        normalizeOptionalText(currentImage.altText) || null,
                    position: Number(currentImage.position ?? index),
                };
            })
            .filter((image) => image.imageUrl && image.publicId)
            .map((image, index) => ({
                ...image,
                position: Number.isFinite(image.position)
                    ? image.position
                    : index,
            }))
        : [];

    const position = Number(input.position ?? 0);

    return {
        success: true,
        data: {
            title,
            slug,
            shortDescription,
            description,
            type,
            status,
            projectUrl,
            githubUrl,
            coverImageUrl: normalizeOptionalText(
                input.coverImageUrl,
            ),
            coverPublicId: normalizeOptionalText(
                input.coverPublicId,
            ),
            featured: input.featured === true,
            position: Number.isFinite(position) ? position : 0,
            categoryId: normalizeOptionalText(input.categoryId),
            technologyIds: [...new Set(technologyIds)],
            images,
        },
    };
}