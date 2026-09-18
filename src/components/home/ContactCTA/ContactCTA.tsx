import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  createWhatsAppUrl,
  getSiteSettings,
} from "@/lib/site-settings";

import styles from "./styles.module.scss";

const benefits = [
  "Atendimento direto",
  "Soluções personalizadas",
  "Projetos com qualidade",
];

export default async function ContactCTA() {
  const settings = await getSiteSettings();
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp);

  const hasContact =
    Boolean(whatsappUrl) || Boolean(settings.email);

  const hasInformation =
    Boolean(settings.email) ||
    Boolean(settings.phone) ||
    Boolean(settings.location);

  return (
    <section className={styles.section} id="contato">
      <div className={styles.backgroundGlow} />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIdentity}>
            <span className={styles.sectionIcon}>
              <Sparkles size={18} />
            </span>

            <div>
              <strong>Contato profissional</strong>
              <span>Vamos conversar sobre o seu próximo projeto?</span>
            </div>
          </div>

          <div className={styles.connectionStatus}>
            <i />
            Canal direto de atendimento
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.decorativeGrid} />
          <div className={styles.orb} />

          <div className={styles.copy}>
            <span className={styles.eyebrow}>
              <i />
              Tem um projeto em mente?
            </span>

            <h2>
              Vamos transformar sua ideia em uma{" "}
              <em>solução de verdade.</em>
            </h2>

            <p>
              Conte o que você precisa. Podemos conversar sobre
              sistemas web, aplicativos, dashboards e automação de
              processos.
            </p>

            <div className={styles.benefits}>
              {benefits.map((benefit) => (
                <span key={benefit}>
                  <CheckCircle2 size={16} />
                  {benefit}
                </span>
              ))}
            </div>

            {hasInformation && (
              <div className={styles.info}>
                {settings.email && (
                  <a href={`mailto:${settings.email}`}>
                    <span className={styles.infoIcon}>
                      <Mail size={17} />
                    </span>

                    <span className={styles.infoText}>
                      <small>E-mail</small>
                      <strong>{settings.email}</strong>
                    </span>
                  </a>
                )}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  >
                    <span className={styles.infoIcon}>
                      <Phone size={17} />
                    </span>

                    <span className={styles.infoText}>
                      <small>Telefone</small>
                      <strong>{settings.phone}</strong>
                    </span>
                  </a>
                )}

                {settings.location && (
                  <div>
                    <span className={styles.infoIcon}>
                      <MapPin size={17} />
                    </span>

                    <span className={styles.infoText}>
                      <small>Localização</small>
                      <strong>{settings.location}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.contactPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>
                <MessageCircle size={21} />
              </span>

              <div>
                <strong>Vamos conversar?</strong>
                <small>Escolha a melhor forma de contato.</small>
              </div>
            </div>

            {settings.availabilityText && (
              <div className={styles.status}>
                <i />
                {settings.availabilityText}
              </div>
            )}

            <div className={styles.actions}>
              {whatsappUrl && (
                <a
                  className={styles.whatsapp}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <MessageCircle size={20} />
                  </span>

                  <div>
                    <small>Atendimento rápido</small>
                    <strong>Conversar pelo WhatsApp</strong>
                  </div>

                  <ArrowUpRight size={19} />
                </a>
              )}

              {settings.email && (
                <a
                  className={styles.email}
                  href={`mailto:${settings.email}`}
                >
                  <span>
                    <Mail size={19} />
                  </span>

                  <div>
                    <small>Prefere escrever?</small>
                    <strong>Enviar um e-mail</strong>
                  </div>

                  <ArrowUpRight size={19} />
                </a>
              )}
            </div>

            {hasContact ? (
              <div className={styles.security}>
                <ShieldCheck size={15} />

                <span>
                  Contato direto, seguro e sem intermediários.
                </span>
              </div>
            ) : (
              <div className={styles.emptyContact}>
                <MessageCircle size={22} />

                <div>
                  <strong>Contatos em atualização</strong>
                  <span>
                    As formas de contato serão disponibilizadas em
                    breve.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}