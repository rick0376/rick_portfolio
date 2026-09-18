// src/components/admin/AdminSidebar/AdminSidebar.tsx

"use client";

import {
    BarChart3,
    BriefcaseBusiness,
    FolderTree,
    LayoutDashboard,
    LogOut,
    MessageSquareText,
    Settings,
    Tags,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/actions/auth";

import styles from "./styles.module.scss";

type AdminSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const menuItems = [
    {
        label: "Visão geral",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Projetos",
        href: "/admin/projetos",
        icon: BriefcaseBusiness,
    },
    {
        label: "Categorias",
        href: "/admin/categorias",
        icon: FolderTree,
    },
    {
        label: "Tecnologias",
        href: "/admin/tecnologias",
        icon: Tags,
    },
    {
        label: "Mensagens",
        href: "/admin/mensagens",
        icon: MessageSquareText,
    },
    {
        label: "Configurações",
        href: "/admin/configuracoes",
        icon: Settings,
    },
];

export default function AdminSidebar({
    isOpen,
    onClose,
}: AdminSidebarProps) {
    const pathname = usePathname();

    function itemIsActive(href: string) {
        if (href === "/admin") {
            return pathname === href;
        }

        return pathname.startsWith(href);
    }

    return (
        <>
            <button
                className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""
                    }`}
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
            />

            <aside
                className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""
                    }`}
            >
                <div className={styles.brandArea}>
                    <Link
                        className={styles.brand}
                        href="/admin"
                        onClick={onClose}
                    >
                        <span className={styles.logo}>
                            <Image
                                src="/images/brand/rick-pereira.png"
                                alt="Rick Pereira"
                                width={56}
                                height={56}
                            />
                        </span>

                        <span className={styles.brandText}>
                            <strong>Rick Pereira</strong>
                            <small>Painel administrativo</small>
                        </span>
                    </Link>

                    <button
                        className={styles.closeButton}
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav
                    className={styles.navigation}
                    aria-label="Menu administrativo"
                >
                    <span className={styles.menuTitle}>
                        GERENCIAMENTO
                    </span>

                    {menuItems.map(
                        ({
                            label,
                            href,
                            icon: Icon,
                        }) => (
                            <Link
                                key={href}
                                className={
                                    itemIsActive(href)
                                        ? styles.active
                                        : ""
                                }
                                href={href}
                                onClick={onClose}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </Link>
                        ),
                    )}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.statusCard}>
                        <span className={styles.statusIcon}>
                            <BarChart3 size={20} />
                        </span>

                        <div>
                            <strong>Portfólio ativo</strong>
                            <small>
                                Banco de dados conectado
                            </small>
                        </div>
                    </div>

                    <form action={logoutAction}>
                        <button
                            className={styles.logoutButton}
                            type="submit"
                        >
                            <LogOut size={19} />
                            Sair do painel
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}