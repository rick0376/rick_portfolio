// src/components/home/ContactBar/ContactBar.tsx

import {
    Github,
    Linkedin,
    Mail,
    MapPin,
} from "lucide-react";

import {
    createWhatsAppUrl,
    getSiteSettings,
    getSocialDisplayValue,
} from "@/lib/site-settings";

import styles from "./styles.module.scss";

type WhatsAppIconProps = {
    size?: number;
    strokeWidth?: number;
};

function WhatsAppIcon({
    size = 19,
    strokeWidth = 1.8,
}: WhatsAppIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.4-4.25A8.5 8.5 0 1 1 20.5 11.7Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M8.2 7.75c.2-.45.4-.46.7-.47h.6c.18 0 .38.06.48.31l.78 1.88c.08.2.04.4-.08.57l-.6.77a.47.47 0 0 0-.04.55c.42.75 1.06 1.42 1.8 1.91.72.48 1.34.75 1.75.91.21.08.45.02.59-.16l.72-.9c.16-.2.38-.26.6-.18l1.78.84c.23.11.36.22.4.4.05.2-.04 1.13-.58 1.77-.52.61-1.31.91-2.13.91-.61 0-1.4-.17-2.75-.76a10.2 10.2 0 0 1-3.56-2.72 8.7 8.7 0 0 1-1.8-2.83c-.4-1.08-.04-2.15.34-2.75Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default async function ContactBar() {
    const settings = await getSiteSettings();

    const whatsappUrl = createWhatsAppUrl(
        settings.whatsapp,
    );

    const contacts = [
        settings.email
            ? {
                icon: Mail,
                label: "E-mail",
                value: settings.email,
                href: `mailto:${settings.email}`,
                variant: "email",
            }
            : null,

        whatsappUrl && settings.whatsapp
            ? {
                icon: WhatsAppIcon,
                label: "WhatsApp",
                value: settings.whatsapp,
                href: whatsappUrl,
                variant: "whatsapp",
            }
            : null,

        settings.linkedinUrl
            ? {
                icon: Linkedin,
                label: "LinkedIn",
                value: getSocialDisplayValue(
                    settings.linkedinUrl,
                ),
                href: settings.linkedinUrl,
                variant: "linkedin",
            }
            : null,

        settings.githubUrl
            ? {
                icon: Github,
                label: "GitHub",
                value: getSocialDisplayValue(
                    settings.githubUrl,
                ),
                href: settings.githubUrl,
                variant: "github",
            }
            : null,

        settings.location
            ? {
                icon: MapPin,
                label: "Localização",
                value: settings.location,
                href: "#contato",
                variant: "location",
            }
            : null,
    ].filter(
        (
            contact,
        ): contact is NonNullable<typeof contact> =>
            contact !== null,
    );

    if (contacts.length === 0) {
        return null;
    }

    return (
        <div className={styles.contactBar}>
            {contacts.map(
                ({
                    icon: Icon,
                    label,
                    value,
                    href,
                    variant,
                }) => {
                    const isExternal =
                        href.startsWith("http");

                    return (
                        <a
                            className={`${styles.contactItem} ${styles[variant]}`}
                            href={href}
                            key={label}
                            target={
                                isExternal ? "_blank" : undefined
                            }
                            rel={
                                isExternal
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            aria-label={`${label}: ${value}`}
                            title={`${label}: ${value}`}
                        >
                            <span className={styles.iconBox}>
                                <Icon
                                    size={19}
                                    strokeWidth={1.9}
                                />
                            </span>

                            <span className={styles.information}>
                                <small>{label}</small>
                                <strong>{value}</strong>
                            </span>
                        </a>
                    );
                },
            )}
        </div>
    );
}