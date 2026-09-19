// src/components/curriculum/CurriculumViewer/CurriculumViewer.tsx

"use client";

import dynamic from "next/dynamic";

type CurriculumViewerProps = {
    curriculumUrl: string;
    professionalName: string;
};

const CurriculumViewerClient =
    dynamic<CurriculumViewerProps>(
        () =>
            import("./CurriculumViewerClient").then(
                (module) => module.default,
            ),
        {
            ssr: false,
            loading: () => (
                <div
                    style={{
                        width: "100%",
                        minHeight: 500,
                        borderRadius: 20,
                        background: "#e9eef5",
                    }}
                />
            ),
        },
    );

export default function CurriculumViewer(
    props: CurriculumViewerProps,
) {
    return <CurriculumViewerClient {...props} />;
}