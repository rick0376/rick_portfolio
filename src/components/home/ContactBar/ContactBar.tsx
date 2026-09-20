// src/components/home/ContactBar/ContactBar.tsx

import {
    Github,
    Linkedin,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
} from "lucide-react";

import {
    createWhatsAppUrl,
    getSiteSettings,
    getSocialDisplayValue,
} from "@/lib/site-settings";

import styles from "./styles.module.scss";

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
                icon: MessageCircle,
                label: "WhatsApp",
                value: settings.whatsapp,
                href: whatsappUrl,
                variant: "whatsapp",
            }
            : null,

        settings.phone
            ? {
                icon: Phone,
                label: "Telefone",
                value: settings.phone,
                href: `tel:${settings.phone.replace(
                    /\D/g,
                    "",
                )}`,
                variant: "phone",
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