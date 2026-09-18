// src/components/home/Technologies/Technologies.tsx

import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import {
  BarChart3,
  Cloud,
  CodeXml,
  Database,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";
import styles from "./styles.module.scss";

const technologies = [
  {
    icon: CodeXml,
    name: "Next.js",
    description: "Aplicações web modernas",
    number: "01",
    accent: "blue",
  },
  {
    icon: Layers3,
    name: "React",
    description: "Interfaces rápidas e escaláveis",
    number: "02",
    accent: "cyan",
  },
  {
    icon: Smartphone,
    name: "React Native",
    description: "Aplicativos para celular",
    number: "03",
    accent: "violet",
  },
  {
    icon: BarChart3,
    name: "Power BI",
    description: "Dashboards e indicadores",
    number: "04",
    accent: "yellow",
  },
  {
    icon: Database,
    name: "PostgreSQL",
    description: "Dados seguros e organizados",
    number: "05",
    accent: "indigo",
  },
  {
    icon: Cloud,
    name: "Cloud",
    description: "Vercel, Neon e Cloudinary",
    number: "06",
    accent: "sky",
  },
];

export default function Technologies() {
  return (
    <section
      className={styles.section}
      id="habilidades"
    >
      <div className={styles.backgroundGlow} />

      <div className={styles.inner}>
        <div
          className={styles.intro}
          id="sobre"
        >
          <SectionHeading
            light
            eyebrow="Tecnologia com visão de negócio"
            title="Ferramentas certas. Soluções bem construídas."
            description="Minha experiência em processos, qualidade e gestão fortalece cada projeto. Não penso apenas no código: penso em quem vai utilizar e no resultado que a solução precisa entregar."
          />

          <div className={styles.metric}>
            <div className={styles.metricHeader}>
              <span>
                <Sparkles size={16} />
                Visão integrada
              </span>

              <i />
            </div>

            <strong>360°</strong>

            <p>
              Processo, usuário e tecnologia
              trabalhando na mesma direção.
            </p>

            <div className={styles.metricTags}>
              <span>Processos</span>
              <span>Pessoas</span>
              <span>Tecnologia</span>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {technologies.map(
            ({
              icon: Icon,
              name,
              description,
              number,
              accent,
            }) => (
              <article
                className={`${styles.card} ${styles[accent]}`}
                key={name}
              >
                <span className={styles.number}>
                  {number}
                </span>

                <span className={styles.icon}>
                  <Icon
                    size={22}
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}