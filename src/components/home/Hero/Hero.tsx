// src/components/home/Hero/Hero.tsx

import ContactBar from "@/components/home/ContactBar/ContactBar";
import {
  ArrowUpRight,
  FileText,
  Lightbulb,
  Rocket,
  Target,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./styles.module.scss";

const highlights = [
  {
    icon: Target,
    title: "Foco em",
    description: "soluções reais",
  },
  {
    icon: UsersRound,
    title: "Aprendizado",
    description: "contínuo",
  },
  {
    icon: Rocket,
    title: "Projetos que",
    description: "geram impacto",
  },
  {
    icon: Lightbulb,
    title: "Parceria e",
    description: "transparência",
  },
];

export default function Hero() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.backgroundGlow} />

      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>
              Olá, eu sou
            </span>

            <h1>
              Luis Henrique <em>Pereira</em>
            </h1>

            <h2>
              Portfólio, Currículo e Projetos
            </h2>

            <p>
              Desenvolvo sites, aplicativos, dashboards
              e soluções digitais que transformam ideias
              em resultados. Trabalho com tecnologias
              modernas para criar produtos web e mobile
              de alta qualidade. Sempre focado em
              performance, usabilidade e valor para o
              negócio.
            </p>

            <div className={styles.actions}>
              <a
                className={styles.primary}
                href="#projetos"
              >
                <ArrowUpRight size={18} />
                Ver projetos
              </a>

              <Link
                className={styles.secondary}
                href="/curriculo"
              >
                <FileText size={18} />
                Ver currículo
              </Link>
            </div>
          </div>

          <div className={styles.photoArea}>
            <div className={styles.photoFrame}>
              <Image
                src="/images/profile/luis-henrique.png"
                alt="Luis Henrique Pereira"
                width={1254}
                height={1254}
                priority
              />

              <div className={styles.photoMessage}>
                <span>Tecnologia</span>
                <span>Ideias</span>
                <span>Resultados</span>
              </div>
            </div>
          </div>

          <aside className={styles.highlights}>
            <div className={styles.highlightList}>
              {highlights.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <div
                    className={
                      styles.highlightItem
                    }
                    key={description}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                    />

                    <div>
                      <strong>{title}</strong>
                      <span>
                        {description}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <blockquote>
              “Disciplina hoje,
              <br />
              resultados amanhã.”
            </blockquote>
          </aside>
        </div>

        <ContactBar />
      </div>
    </section>
  );
}