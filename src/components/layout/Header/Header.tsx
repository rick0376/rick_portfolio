// src/components/layout/Header/Header.tsx

"use client";

import { Menu, Moon, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

const links = [
  {
    label: "Início",
    href: "/#inicio",
    section: "inicio",
  },
  {
    label: "Sobre",
    href: "/#sobre",
    section: "sobre",
  },
  {
    label: "Projetos",
    href: "/#projetos",
    section: "projetos",
  },
  {
    label: "Habilidades",
    href: "/#habilidades",
    section: "habilidades",
  },
  {
    label: "Contato",
    href: "/#contato",
    section: "contato",
  },
];

export default function Header() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);

      if (pathname !== "/") {
        if (pathname.startsWith("/projetos")) {
          setActiveSection("projetos");
        } else {
          setActiveSection("");
        }

        return;
      }

      const sections = links
        .map((link) => document.getElementById(link.section))
        .filter(
          (section): section is HTMLElement => Boolean(section),
        );

      const currentSection =
        [...sections]
          .reverse()
          .find(
            (section) =>
              section.getBoundingClientRect().top <= 150,
          ) || sections[0];

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenu(section: string) {
    setMenuOpen(false);
    setActiveSection(section);
  }

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ""
        }`}
    >
      <div className={styles.headerGlow} />

      <div className={styles.inner}>
        <Link
          className={styles.brand}
          href="/#inicio"
          onClick={() => closeMenu("inicio")}
          aria-label="Voltar para a página principal"
        >
          <span className={styles.initialsBox}>
            <strong className={styles.initials}>LHP</strong>
          </span>

          <span className={styles.brandText}>
            <strong>Luis Henrique Pereira</strong>

            <small>Desenvolvimento que gera resultados</small>
          </span>
        </Link>

        <nav
          className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""
            }`}
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <Link
              className={
                activeSection === link.section
                  ? styles.activeLink
                  : undefined
              }
              key={link.section}
              href={link.href}
              onClick={() => closeMenu(link.section)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            className={styles.mobileContact}
            href="/#contato"
            onClick={() => closeMenu("contato")}
          >
            Vamos conversar
            <Send size={17} />
          </Link>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.themeButton}
            type="button"
            aria-label="Alterar tema"
          >
            <Moon size={18} />
          </button>

          <Link
            className={styles.contactButton}
            href="/#contato"
            onClick={() => closeMenu("contato")}
          >
            <span>Vamos conversar</span>
            <Send size={16} />
          </Link>

          <button
            className={styles.menuButton}
            type="button"
            onClick={() =>
              setMenuOpen((currentMenuOpen) => !currentMenuOpen)
            }
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}