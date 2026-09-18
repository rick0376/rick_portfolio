// src/components/admin/AdminHeader/AdminHeader.tsx

"use client";

import {
    ExternalLink,
    Menu,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

type AdminHeaderProps = {
    adminName: string;
    adminEmail: string;
    onOpenMenu: () => void;
};

export default function AdminHeader({
    adminName,
    adminEmail,
    onOpenMenu,
}: AdminHeaderProps) {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(
            new Intl.DateTimeFormat("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }).format(new Date()),
        );
    }, []);

    const firstName =
        adminName.trim().split(" ")[0] || "Administrador";

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuButton}
                    type="button"
                    onClick={onOpenMenu}
                    aria-label="Abrir menu"
                >
                    <Menu size={23} />
                </button>

                <div className={styles.welcome}>
                    <strong>Olá, {firstName}!</strong>
                    <span>
                        {currentDate || "Carregando data..."}
                    </span>
                </div>
            </div>

            <div className={styles.actions}>
                <Link
                    className={styles.portfolioLink}
                    href="/"
                    target="_blank"
                >
                    Ver portfólio
                    <ExternalLink size={17} />
                </Link>

                <div className={styles.profile}>
                    <span className={styles.avatar}>
                        <UserRound size={20} />
                    </span>

                    <div>
                        <strong>{adminName}</strong>
                        <small>{adminEmail}</small>
                    </div>
                </div>
            </div>
        </header>
    );
}