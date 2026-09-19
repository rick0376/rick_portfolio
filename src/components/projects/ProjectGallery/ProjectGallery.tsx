// src/components/projects/ProjectGallery/ProjectGallery.tsx

"use client";

import type { ProjectImage } from "@/types/project";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import styles from "./styles.module.scss";

type ProjectGalleryProps = {
    projectTitle: string;
    coverImageUrl: string | null;
    images: ProjectImage[];
};

export default function ProjectGallery({
    projectTitle,
    coverImageUrl,
    images,
}: ProjectGalleryProps) {
    const galleryImages = useMemo(() => {
        const orderedImages = [...images].sort(
            (firstImage, secondImage) =>
                firstImage.position -
                secondImage.position,
        );

        const uniqueImages = orderedImages.filter(
            (image, index, currentImages) => {
                const isCover =
                    Boolean(coverImageUrl) &&
                    image.imageUrl === coverImageUrl;

                const firstOccurrence =
                    currentImages.findIndex(
                        (currentImage) =>
                            currentImage.imageUrl ===
                            image.imageUrl ||
                            (Boolean(image.publicId) &&
                                currentImage.publicId ===
                                image.publicId),
                    ) === index;

                return !isCover && firstOccurrence;
            },
        );

        if (!coverImageUrl) {
            return uniqueImages;
        }

        return [
            {
                id: "cover",
                imageUrl: coverImageUrl,
                publicId: "cover",
                altText: `Imagem de capa do projeto ${projectTitle}`,
                position: 0,
            },
            ...uniqueImages,
        ];
    }, [coverImageUrl, images, projectTitle]);

    const [selectedImage, setSelectedImage] =
        useState<string | null>(
            galleryImages[0]?.imageUrl ?? null,
        );

    useEffect(() => {
        const selectedStillExists =
            galleryImages.some(
                (image) =>
                    image.imageUrl === selectedImage,
            );

        if (!selectedStillExists) {
            setSelectedImage(
                galleryImages[0]?.imageUrl ?? null,
            );
        }
    }, [galleryImages, selectedImage]);

    const selectedImageData = galleryImages.find(
        (image) =>
            image.imageUrl === selectedImage,
    );

    if (galleryImages.length === 0) {
        return (
            <div className={styles.empty}>
                <span>
                    <ImageIcon size={32} />
                </span>

                <strong>Galeria em preparação</strong>

                <p>
                    As imagens deste projeto serão
                    adicionadas em breve.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                {selectedImage && (
                    <Image
                        src={selectedImage}
                        alt={
                            selectedImageData?.altText ||
                            `Imagem do projeto ${projectTitle}`
                        }
                        fill
                        priority
                        sizes="(max-width: 900px) 100vw, 72vw"
                    />
                )}
            </div>

            {galleryImages.length > 1 && (
                <div className={styles.thumbnails}>
                    {galleryImages.map(
                        (image, index) => (
                            <button
                                className={
                                    selectedImage ===
                                        image.imageUrl
                                        ? styles.active
                                        : undefined
                                }
                                type="button"
                                key={`${image.id}-${image.imageUrl}`}
                                onClick={() =>
                                    setSelectedImage(
                                        image.imageUrl,
                                    )
                                }
                                aria-label={`Visualizar imagem ${index + 1} do projeto`}
                            >
                                <Image
                                    src={image.imageUrl}
                                    alt={
                                        image.altText ||
                                        `Miniatura ${index + 1}`
                                    }
                                    fill
                                    sizes="130px"
                                />

                                <span>{index + 1}</span>
                            </button>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}