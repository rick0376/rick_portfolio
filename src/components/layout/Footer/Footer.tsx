// src/components/layout/Footer/Footer.tsx

import {
  ArrowUp,
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
} from "@/lib/site-settings";

import AppLogo from "../AppLogo/AppLogo";
import styles from "./styles.module.scss";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Contato", href: "#contato" },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp,
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <AppLogo />

            <p>
              {settings.biography ||
                "Desenvolvimento de sistemas, aplicativos e dashboards que transformam ideias em resultados."}
            </p>

            {settings.availabilityText && (
              <div className={styles.availability}>
                <i />
                {settings.availabilityText}
              </div>
            )}
          </div>

          <div className={styles.navigationColumn}>
            <span className={styles.columnTitle}>
              Navegação
            </span>

            <nav aria-label="Navegação do rodapé">
              {navigation.map((item) => (
                <a href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.contactColumn}>
            <span className={styles.columnTitle}>
              Entre em contato
            </span>

            {settings.email && (
              <a href={`mailto:${settings.email}`}>
                <Mail size={16} />
                {settings.email}
              </a>
            )}

            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(
                  /\D/g,
                  "",
                )}`}
              >
                <Phone size={16} />
                {settings.phone}
              </a>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} />
                Conversar pelo WhatsApp
              </a>
            )}

            {settings.location && (
              <span>
                <MapPin size={16} />
                {settings.location}
              </span>
            )}
          </div>

          <div className={styles.socialColumn}>
            <span className={styles.columnTitle}>
              Redes profissionais
            </span>

            <div className={styles.social}>
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin size={19} />
                </a>
              )}

              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar GitHub"
                  title="GitHub"
                >
                  <Github size={19} />
                </a>
              )}

              {whatsappUrl && (
                <a
                  className={styles.whatsappSocial}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conversar pelo WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle size={19} />
                </a>
              )}
            </div>

            <a
              className={styles.backToTop}
              href="#inicio"
            >
              Voltar ao topo
              <ArrowUp size={16} />
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()}{" "}
            {settings.professionalName}. Todos os direitos
            reservados.
          </p>

          <span>
            Criado com tecnologia, dedicação e propósito.
          </span>
        </div>
      </div>
    </footer>
  );
}