// src/app/manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "/",
        name: "Portfólio Rick Pereira",
        short_name: "Rick Pereira",
        description:
            "Portfólio profissional de Luis Henrique Pereira, com sistemas, aplicativos, dashboards e soluções digitais.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#020817",
        theme_color: "#020817",
        lang: "pt-BR",
        categories: [
            "portfolio",
            "business",
            "productivity",
            "technology",
        ],
        icons: [
            {
                src: "/images/brand/rick-pereira.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/images/brand/rick-pereira.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}