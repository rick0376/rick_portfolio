// src/components/layout/Footer/Footer.tsx

import {
  Github,
  Linkedin,
  LockKeyhole,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";

import {
  createWhatsAppUrl,
  getSiteSettings,
} from "@/lib/site-settings";

import styles from "./styles.module.scss";

const navigation = [
  { label: "Início", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Habilidades", href: "/#habilidades" },
  { label: "Contato", href: "/#contato" },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  const email =
    settings.email || "contato@rickpereira.dev";

  const whatsappUrl =
    createWhatsAppUrl(settings.whatsapp) || "#contato";

  const linkedinUrl =
    settings.linkedinUrl ||
    "https://www.linkedin.com/in/luis-henrique-pereira-adm/";

  const githubUrl =
    settings.githubUrl || "https://github.com";

  return (
    <footer className={styles.footer}>
      <section className={styles.cta}>
        <div className={styles.ctaBackground} />

        <div className={styles.ctaContent}>
          <div className={styles.ctaCopy}>
            <h2>Vamos transformar ideias em realidade?</h2>

            <p>
              Estou sempre aberto a novos desafios e oportunidades.
              Entre em contato e vamos conversar sobre o seu projeto!
            </p>
          </div>

          <a
            className={styles.contactButton}
            href={whatsappUrl}
            target={
              whatsappUrl.startsWith("http")
                ? "_blank"
                : undefined
            }
            rel={
              whatsappUrl.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
          >
            <Send size={16} />
            Entrar em contato
          </a>

          <blockquote>
            “Tecnologia
            <br />
            para um futuro melhor.”
          </blockquote>
        </div>
      </section>

      <section className={styles.footerBar}>
        <div className={styles.footerContent}>
          <Link className={styles.brand} href="/#inicio">
            <strong>LHP</strong>

            <span>
              {settings.professionalName ||
                "Luis Henrique Pereira"}
            </span>
          </Link>

          <nav
            className={styles.navigation}
            aria-label="Navegação do rodapé"
          >
            {navigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.social}>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar GitHub"
              title="GitHub"
            >
              <Github size={16} />
            </a>

            <a
              className={styles.whatsapp}
              href={whatsappUrl}
              target={
                whatsappUrl.startsWith("http")
                  ? "_blank"
                  : undefined
              }
              rel={
                whatsappUrl.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-label="Conversar pelo WhatsApp"
              title="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            <a
              href={`mailto:${email}`}
              aria-label="Enviar e-mail"
              title="E-mail"
            >
              <Mail size={16} />
            </a>
          </div>

          <div className={styles.right}>
            <span>
              Feito com dedicação
              <i />
              © {new Date().getFullYear()}
            </span>

            <Link
              className={styles.adminButton}
              href="/admin/login"
              aria-label="Acessar área administrativa"
              title="Área administrativa"
            >
              <LockKeyhole size={15} />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}