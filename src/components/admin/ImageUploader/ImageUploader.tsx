// src/components/admin/ImageUploader/ImageUploader.tsx

"use client";

import {
    ArrowDown,
    ArrowUp,
    ImagePlus,
    LoaderCircle,
    Star,
    Trash2,
    UploadCloud,
} from "lucide-react";
import Image from "next/image";
import {
    type ChangeEvent,
    useRef,
    useState,
} from "react";
import styles from "./styles.module.scss";

export type UploadedImage = {
    imageUrl: string;
    publicId: string;
    altText: string | null;
    position: number;
};

type ImageUploaderProps = {
    coverImage: UploadedImage | null;
    galleryImages: UploadedImage[];
    onCoverChange: (
        image: UploadedImage | null,
    ) => void;
    onGalleryChange: (
        images: UploadedImage[],
    ) => void;
};

type UploadResponse = {
    message?: string;
    image?: {
        imageUrl: string;
        publicId: string;
    };
};

async function uploadImage(
    file: File,
    folder: "portfolio/capa" | "portfolio/galeria",
) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(
        "/api/cloudinary/upload",
        {
            method: "POST",
            body: formData,
        },
    );

    const data = (await response.json()) as UploadResponse;

    if (!response.ok || !data.image) {
        throw new Error(
            data.message ||
            "Não foi possível enviar a imagem.",
        );
    }

    return data.image;
}

async function deleteImage(publicId: string) {
    const response = await fetch(
        "/api/cloudinary/delete",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicId,
            }),
        },
    );

    const data = (await response.json()) as {
        message?: string;
    };

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Não foi possível excluir a imagem.",
        );
    }
}

export default function ImageUploader({
    coverImage,
    galleryImages,
    onCoverChange,
    onGalleryChange,
}: ImageUploaderProps) {
    const coverInputRef =
        useRef<HTMLInputElement>(null);

    const galleryInputRef =
        useRef<HTMLInputElement>(null);

    const [uploadingCover, setUploadingCover] =
        useState(false);

    const [uploadingGallery, setUploadingGallery] =
        useState(false);

    const [deletingPublicId, setDeletingPublicId] =
        useState<string | null>(null);

    const [message, setMessage] = useState("");

    function openCoverSelector() {
        setMessage("");
        coverInputRef.current?.click();
    }

    function openGallerySelector() {
        setMessage("");
        galleryInputRef.current?.click();
    }

    async function handleCoverUpload(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setMessage("");
        setUploadingCover(true);

        try {
            const uploadedImage = await uploadImage(
                file,
                "portfolio/capa",
            );

            const previousCoverPublicId =
                coverImage?.publicId;

            onCoverChange({
                imageUrl: uploadedImage.imageUrl,
                publicId: uploadedImage.publicId,
                altText: null,
                position: 0,
            });

            if (
                previousCoverPublicId &&
                previousCoverPublicId !==
                uploadedImage.publicId
            ) {
                await deleteImage(
                    previousCoverPublicId,
                ).catch((error) => {
                    console.error(
                        "Não foi possível excluir a capa anterior:",
                        error,
                    );
                });
            }
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível enviar a capa.",
            );
        } finally {
            setUploadingCover(false);
            event.target.value = "";
        }
    }

    async function handleGalleryUpload(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const files = Array.from(
            event.target.files ?? [],
        );

        if (files.length === 0) {
            return;
        }

        setMessage("");
        setUploadingGallery(true);

        const uploadedImages: UploadedImage[] = [];

        try {
            for (const file of files) {
                const uploadedImage = await uploadImage(
                    file,
                    "portfolio/galeria",
                );

                uploadedImages.push({
                    imageUrl: uploadedImage.imageUrl,
                    publicId: uploadedImage.publicId,
                    altText: null,
                    position:
                        galleryImages.length +
                        uploadedImages.length,
                });
            }

            onGalleryChange([
                ...galleryImages,
                ...uploadedImages,
            ]);
        } catch (error) {
            if (uploadedImages.length > 0) {
                onGalleryChange([
                    ...galleryImages,
                    ...uploadedImages,
                ]);
            }

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível enviar todas as imagens.",
            );
        } finally {
            setUploadingGallery(false);
            event.target.value = "";
        }
    }

    async function removeCover() {
        if (!coverImage) {
            return;
        }

        const imageToRemove = coverImage;

        setMessage("");
        setDeletingPublicId(
            imageToRemove.publicId,
        );

        try {
            await deleteImage(
                imageToRemove.publicId,
            );

            onCoverChange(null);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a capa.",
            );
        } finally {
            setDeletingPublicId(null);
        }
    }

    async function removeGalleryImage(
        image: UploadedImage,
    ) {
        setMessage("");
        setDeletingPublicId(image.publicId);

        try {
            await deleteImage(image.publicId);

            const remainingImages = galleryImages
                .filter(
                    (currentImage) =>
                        currentImage.publicId !==
                        image.publicId,
                )
                .map((currentImage, index) => ({
                    ...currentImage,
                    position: index,
                }));

            onGalleryChange(remainingImages);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível excluir a imagem.",
            );
        } finally {
            setDeletingPublicId(null);
        }
    }

    function moveImage(
        currentIndex: number,
        direction: "up" | "down",
    ) {
        const destinationIndex =
            direction === "up"
                ? currentIndex - 1
                : currentIndex + 1;

        if (
            destinationIndex < 0 ||
            destinationIndex >=
            galleryImages.length
        ) {
            return;
        }

        const updatedImages = [
            ...galleryImages,
        ];

        const currentImage =
            updatedImages[currentIndex];

        updatedImages[currentIndex] =
            updatedImages[destinationIndex];

        updatedImages[destinationIndex] =
            currentImage;

        onGalleryChange(
            updatedImages.map(
                (image, index) => ({
                    ...image,
                    position: index,
                }),
            ),
        );
    }

    function updateAltText(
        index: number,
        altText: string,
    ) {
        onGalleryChange(
            galleryImages.map(
                (image, imageIndex) =>
                    imageIndex === index
                        ? {
                            ...image,
                            altText,
                        }
                        : image,
            ),
        );
    }

    return (
        <div className={styles.uploader}>
            <section className={styles.block}>
                <div className={styles.heading}>
                    <div>
                        <span
                            className={styles.headingIcon}
                        >
                            <Star size={19} />
                        </span>

                        <div>
                            <strong>
                                Imagem de capa
                            </strong>

                            <p>
                                Pasta: portfolio/capa
                            </p>
                        </div>
                    </div>

                    <button
                        className={
                            styles.uploadButton
                        }
                        type="button"
                        onClick={openCoverSelector}
                        disabled={uploadingCover}
                    >
                        {uploadingCover ? (
                            <LoaderCircle
                                className={styles.spin}
                                size={17}
                            />
                        ) : (
                            <UploadCloud size={17} />
                        )}

                        {coverImage
                            ? "Trocar capa"
                            : "Enviar capa"}
                    </button>

                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        hidden
                        onChange={
                            handleCoverUpload
                        }
                    />
                </div>

                {coverImage ? (
                    <div
                        className={
                            styles.coverPreview
                        }
                    >
                        <Image
                            src={coverImage.imageUrl}
                            alt={
                                coverImage.altText ||
                                "Capa do projeto"
                            }
                            fill
                            sizes="700px"
                        />

                        <div
                            className={
                                styles.coverActions
                            }
                        >
                            <span>Capa principal</span>

                            <button
                                type="button"
                                onClick={removeCover}
                                disabled={
                                    deletingPublicId ===
                                    coverImage.publicId
                                }
                                aria-label="Excluir imagem de capa"
                            >
                                {deletingPublicId ===
                                    coverImage.publicId ? (
                                    <LoaderCircle
                                        className={
                                            styles.spin
                                        }
                                        size={17}
                                    />
                                ) : (
                                    <Trash2 size={17} />
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className={
                            styles.emptyCover
                        }
                        type="button"
                        onClick={openCoverSelector}
                    >
                        <span>
                            <ImagePlus size={27} />
                        </span>

                        <strong>
                            Adicione uma imagem de capa
                        </strong>

                        <small>
                            JPG, PNG, WEBP ou AVIF —
                            máximo de 10 MB
                        </small>
                    </button>
                )}
            </section>

            <section className={styles.block}>
                <div className={styles.heading}>
                    <div>
                        <span
                            className={styles.headingIcon}
                        >
                            <ImagePlus size={19} />
                        </span>

                        <div>
                            <strong>
                                Galeria do projeto
                            </strong>

                            <p>
                                Pasta: portfolio/galeria
                            </p>
                        </div>
                    </div>

                    <button
                        className={
                            styles.uploadButton
                        }
                        type="button"
                        onClick={
                            openGallerySelector
                        }
                        disabled={
                            uploadingGallery
                        }
                    >
                        {uploadingGallery ? (
                            <LoaderCircle
                                className={styles.spin}
                                size={17}
                            />
                        ) : (
                            <ImagePlus size={17} />
                        )}

                        Adicionar imagens
                    </button>

                    <input
                        ref={galleryInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        hidden
                        onChange={
                            handleGalleryUpload
                        }
                    />
                </div>

                {galleryImages.length > 0 ? (
                    <div
                        className={styles.gallery}
                    >
                        {galleryImages.map(
                            (image, index) => (
                                <article
                                    className={
                                        styles.galleryItem
                                    }
                                    key={image.publicId}
                                >
                                    <div
                                        className={
                                            styles.galleryImage
                                        }
                                    >
                                        <Image
                                            src={image.imageUrl}
                                            alt={
                                                image.altText ||
                                                `Imagem ${index + 1}`
                                            }
                                            fill
                                            sizes="260px"
                                        />

                                        <span>
                                            {index + 1}
                                        </span>
                                    </div>

                                    <input
                                        value={
                                            image.altText ?? ""
                                        }
                                        placeholder="Descrição da imagem"
                                        onChange={(event) =>
                                            updateAltText(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                    />

                                    <div
                                        className={
                                            styles.galleryActions
                                        }
                                    >
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() =>
                                                moveImage(
                                                    index,
                                                    "up",
                                                )
                                            }
                                            aria-label="Mover imagem para cima"
                                        >
                                            <ArrowUp
                                                size={16}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                index ===
                                                galleryImages.length -
                                                1
                                            }
                                            onClick={() =>
                                                moveImage(
                                                    index,
                                                    "down",
                                                )
                                            }
                                            aria-label="Mover imagem para baixo"
                                        >
                                            <ArrowDown
                                                size={16}
                                            />
                                        </button>

                                        <button
                                            className={
                                                styles.deleteButton
                                            }
                                            type="button"
                                            disabled={
                                                deletingPublicId ===
                                                image.publicId
                                            }
                                            onClick={() =>
                                                removeGalleryImage(
                                                    image,
                                                )
                                            }
                                            aria-label="Excluir imagem"
                                        >
                                            {deletingPublicId ===
                                                image.publicId ? (
                                                <LoaderCircle
                                                    className={
                                                        styles.spin
                                                    }
                                                    size={16}
                                                />
                                            ) : (
                                                <Trash2
                                                    size={16}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>
                ) : (
                    <button
                        className={
                            styles.emptyGallery
                        }
                        type="button"
                        onClick={
                            openGallerySelector
                        }
                    >
                        <ImagePlus size={25} />

                        <strong>
                            Nenhuma imagem na galeria
                        </strong>

                        <small>
                            Clique para selecionar uma
                            ou várias imagens.
                        </small>
                    </button>
                )}
            </section>

            {message && (
                <p className={styles.error}>
                    {message}
                </p>
            )}
        </div>
    );
}