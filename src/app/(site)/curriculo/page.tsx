// src/app/(site)/curriculo/page.tsx

import {
    ArrowLeft,
    BriefcaseBusiness,
    Download,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getSiteSettings } from "@/lib/site-settings";

import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Currículo profissional",
    description:
        "Currículo profissional de Luis Henrique Pereira, com experiências, formações e competências.",
};

const professionalProfile = [
    "Profissional com ampla trajetória em rotinas administrativas, controles internos, qualidade, processos e suporte à gestão.",
    "Experiência em organização documental, acompanhamento operacional, conferências, inspeção, rastreabilidade, registros técnicos e cumprimento de padrões internos.",
    "Formação multidisciplinar em Engenharia de Produção, Tecnologia da Informação, Mecânica e Informática.",
    "Cursando Bacharelado em Ciências Contábeis. (Cursos de Contabilidade e Matemática Financeira paralelos concluídos.)",
    "Conhecimentos em Excel avançado, Power BI, indicadores, análise de dados, apoio contábil/fiscal e melhoria de processos.",
    "Conhecimentos em Linguagens de Programação com construções de projetos reais como sites, aplicativos e sistemas mobiles e desktop.",
];

const keySkills = [
    "Rotinas administrativas e organização documental",
    "Controles financeiros e relatórios gerenciais",
    "Excel avançado, gráficos, macros e VBA",
    "Power BI, dashboards e indicadores",
    "Qualidade, inspeção e melhoria de processos",
    "Atendimento, liderança e gestão operacional",
    "Informática, dados e suporte técnico",
    "Imposto de renda pessoa física",
];

const tools = [
    "Excel",
    "Power BI",
    "Pacote Office",
    "Python aplicado a dados",
    "VBA / macros",
    "Técnico em Informática",
    "Next.js / Python / React Native / C#",
];

const ongoingCourses = [
    "Bacharelado Ciências Contábeis - Cruzeiro do Sul",
    "Perícia Contábil - Contabilidade Facilitada",
    "Contabilidade - Udemy",
    "Matemática Financeira - Udemy",
    "Recursos Humanos - Udemy",
    "Ciência de Dados - Hashtag Treinamentos",
];

const experiences = [
    {
        role: "Inspetor da Qualidade",
        company: "Confab Industrial",
        period: "2002 a 2024",
        activities: [
            "Atuação em inspeção da qualidade, controle visual e dimensional, rastreabilidade e registros técnicos.",
            "Acompanhamento da conformidade de processos, padrões internos, análise de falhas e tomada de decisão em rotina operacional.",
            "Suporte à organização documental, melhoria contínua e padronização de controles da área.",
        ],
    },
    {
        role: "Gerente Administrativo",
        company: "Rede de Postos Sete Estrelas",
        period: "1997 a 2000",
        activities: [
            "Gestão de rotinas administrativas e operacionais, com acompanhamento de equipe e atendimento a clientes.",
            "Controle de documentos, apoio a fechamentos, estoque, caixa e atividades financeiras básicas.",
        ],
    },
    {
        role: "Assistente Administrativo de RH",
        company: "Construcione Engenharia Civil",
        period: "1994 a 1997",
        activities: [
            "Apoio aos processos de RH, organização documental, atendimento interno e conferências administrativas.",
            "Suporte ao escritório central em controles e atividades de apoio a serviços de auditoria.",
        ],
    },
];

const academicEducation = [
    {
        course: "Engenharia de Produção",
        institution: "UNINTER",
        period: "2024",
    },
    {
        course: "Bacharelado em Ciências Contábeis",
        institution: "Cruzeiro do Sul",
        period: "em andamento, conclusão prevista para 2030",
    },
    {
        course: "Tecnologia da Informação",
        institution: "UNIP",
        period: "2012",
    },
    {
        course: "Técnico em Mecânica",
        institution: "ETEC João Gomes de Araújo",
        period: "2009",
    },
    {
        course: "Técnico em Informática",
        institution: "ETEC João Gomes de Araújo",
        period: "2000",
    },
];

const complementaryEducation = [
    "Analista de Dados com especialização em Power BI - Empowerdata - 2025",
    "Formação em Pacote Office | Administração de Empresas com foco em RH - CEBRAC",
    "Técnicas de Negociação - Uninter - 2020",
    "Administração do Tempo - Uninter - 2020",
    "Inspetor de Revestimento - ABENDE | CEP - Controle Estatístico do Processo - SENAI",
    "Curso Global de Qualidade, Rastreabilidade, Análise de Falhas e Tomada de Decisão - SENAI",
    "Medições Mecânicas, Tolerância e Ajustes, Tecnologia de Soldagem e Processos Industriais - SENAI",
];

export default async function CurriculumPage() {
    const settings = await getSiteSettings();

    const curriculumUrl =
        settings.curriculumUrl ||
        "/curriculo/curriculo-luis-henrique-pereira.pdf";

    const phoneUrl = settings.phone
        ? `tel:${settings.phone.replace(/\D/g, "")}`
        : null;

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGrid} />
                <div className={styles.heroGlow} />

                <div className={styles.container}>
                    <div className={styles.heroTop}>
                        <Link
                            className={styles.backButton}
                            href="/"
                        >
                            <ArrowLeft size={18} />
                            Voltar ao portfólio
                        </Link>

                        <a
                            className={styles.downloadButton}
                            href={curriculumUrl}
                            download
                        >
                            <Download size={18} />
                            Baixar currículo em PDF
                        </a>
                    </div>

                    <div className={styles.heroHeading}>
                        <span className={styles.heroIcon}>
                            <FileText size={25} />
                        </span>

                        <div>
                            <span className={styles.eyebrow}>
                                Currículo profissional
                            </span>

                            <h1>
                                {settings.professionalName ||
                                    "Luis Henrique Pereira"}
                            </h1>

                            <p>
                                Inspetor de Qualidade | Qualidade
                                Industrial | Inspeção e Processos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <article className={styles.curriculum}>
                        <aside className={styles.sidebar}>
                            <div className={styles.identity}>
                                <span className={styles.identityMark} />

                                <h2>
                                    Luis Henrique
                                    <br />
                                    Pereira
                                </h2>

                                <p>
                                    Inspetor de Qualidade |
                                    Qualidade Industrial |
                                    Inspeção e Processos
                                </p>
                            </div>

                            <section className={styles.sideSection}>
                                <h3>Contato</h3>

                                <div className={styles.contactList}>
                                    <div
                                        className={
                                            styles.contactItem
                                        }
                                    >
                                        <MapPin size={16} />

                                        <span>
                                            {settings.location ||
                                                "Pindamonhangaba - SP"}
                                        </span>
                                    </div>

                                    {settings.phone && phoneUrl && (
                                        <a
                                            className={
                                                styles.contactItem
                                            }
                                            href={phoneUrl}
                                        >
                                            <Phone size={16} />
                                            <span>
                                                {settings.phone}
                                            </span>
                                        </a>
                                    )}

                                    {settings.email && (
                                        <a
                                            className={
                                                styles.contactItem
                                            }
                                            href={`mailto:${settings.email}`}
                                        >
                                            <Mail size={16} />

                                            <span>
                                                {settings.email}
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </section>

                            <section className={styles.sideSection}>
                                <h3>Competências-chave</h3>

                                <ul>
                                    {keySkills.map((skill) => (
                                        <li key={skill}>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className={styles.sideSection}>
                                <h3>Ferramentas</h3>

                                <ul>
                                    {tools.map((tool) => (
                                        <li key={tool}>
                                            {tool}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className={styles.sideSection}>
                                <h3>Cursos em andamento</h3>

                                <ul>
                                    {ongoingCourses.map((course) => (
                                        <li key={course}>
                                            {course}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className={styles.sideSection}>
                                <h3>Disponibilidade</h3>

                                <p>
                                    Disponibilidade de horários e
                                    rápida adaptação a novos
                                    processos, sistemas e
                                    conhecimentos.
                                </p>
                            </section>
                        </aside>

                        <div className={styles.mainContent}>
                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <BriefcaseBusiness size={19} />
                                    <h2>Perfil profissional</h2>
                                </div>

                                <ul>
                                    {professionalProfile.map(
                                        (item) => (
                                            <li key={item}>
                                                {item}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <BriefcaseBusiness size={19} />
                                    <h2>
                                        Objetivo profissional
                                    </h2>
                                </div>

                                <p>
                                    Atuar como Inspetor de
                                    Qualidade, contribuindo com
                                    minha experiência em inspeção
                                    industrial, controle
                                    dimensional, rastreabilidade,
                                    registros técnicos, análise de
                                    falhas, acompanhamento de
                                    processos e melhoria contínua.
                                </p>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <BriefcaseBusiness size={19} />
                                    <h2>
                                        Experiência profissional
                                    </h2>
                                </div>

                                <div
                                    className={
                                        styles.experienceList
                                    }
                                >
                                    {experiences.map(
                                        (experience) => (
                                            <article
                                                className={
                                                    styles.experience
                                                }
                                                key={
                                                    experience.role
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.experienceHeading
                                                    }
                                                >
                                                    <div>
                                                        <h3>
                                                            {
                                                                experience.role
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                experience.company
                                                            }
                                                        </p>
                                                    </div>

                                                    <span>
                                                        {
                                                            experience.period
                                                        }
                                                    </span>
                                                </div>

                                                <ul>
                                                    {experience.activities.map(
                                                        (
                                                            activity,
                                                        ) => (
                                                            <li
                                                                key={
                                                                    activity
                                                                }
                                                            >
                                                                {
                                                                    activity
                                                                }
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <GraduationCap size={20} />
                                    <h2>
                                        Formação acadêmica
                                    </h2>
                                </div>

                                <div
                                    className={
                                        styles.educationList
                                    }
                                >
                                    {academicEducation.map(
                                        (education) => (
                                            <article
                                                className={
                                                    styles.education
                                                }
                                                key={
                                                    education.course
                                                }
                                            >
                                                <span />

                                                <div>
                                                    <h3>
                                                        {
                                                            education.course
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            education.institution
                                                        }{" "}
                                                        -{" "}
                                                        {
                                                            education.period
                                                        }
                                                    </p>
                                                </div>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <GraduationCap size={20} />
                                    <h2>
                                        Formação complementar
                                        relevante
                                    </h2>
                                </div>

                                <ul>
                                    {complementaryEducation.map(
                                        (education) => (
                                            <li key={education}>
                                                {education}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionTitle}>
                                    <Wrench size={19} />
                                    <h2>Áreas de interesse</h2>
                                </div>

                                <p>
                                    Administrativo,
                                    administrativo-financeiro,
                                    escritório, controles internos,
                                    indicadores, qualidade,
                                    processos, apoio
                                    contábil/fiscal, Power BI e
                                    análise de dados aplicada à
                                    gestão.
                                </p>
                            </section>
                        </div>
                    </article>

                    <div className={styles.bottomActions}>
                        <Link
                            className={styles.bottomBackButton}
                            href="/"
                        >
                            <ArrowLeft size={18} />
                            Voltar ao portfólio
                        </Link>

                        <a
                            className={styles.bottomDownloadButton}
                            href={curriculumUrl}
                            download
                        >
                            <Download size={18} />
                            Baixar currículo em PDF
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}