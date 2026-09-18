// src/app/(auth)/admin/login/page.tsx

import {
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    Code2,
    Database,
    ShieldCheck,
    Smartphone,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

import styles from "./styles.module.scss";

const features = [
    {
        icon: Code2,
        title: "Sistemas web",
        description: "Cadastre e apresente seus projetos em Next.js.",
        variant: "blue",
    },
    {
        icon: Smartphone,
        title: "Aplicativos",
        description: "Organize seus aplicativos desenvolvidos em React Native.",
        variant: "violet",
    },
    {
        icon: BarChart3,
        title: "Dashboards",
        description: "Publique seus painéis e projetos criados no Power BI.",
        variant: "cyan",
    },
];

const benefits = [
    "Projetos e galerias",
    "Tecnologias e categorias",
    "Contatos profissionais",
];

export default async function AdminLoginPage() {
    const admin = await getCurrentAdmin();

    if (admin) {
        redirect("/admin");
    }

    return (
        <main className={styles.page}>
            <section className={styles.presentation}>
                <div className={styles.backgroundGrid} />
                <div className={styles.presentationGlow} />
                <div className={styles.orbOne} />
                <div className={styles.orbTwo} />

                <div className={styles.presentationContent}>
                    <Link className={styles.brand} href="/">
                        <span className={styles.logo}>
                            <Image
                                src="/images/brand/rick-pereira.png"
                                alt="Rick Pereira"
                                width={72}
                                height={72}
                                priority
                            />
                        </span>

                        <span>
                            <strong>Rick Pereira</strong>
                            <small>Sistemas & Aplicativos</small>
                        </span>
                    </Link>

                    <div className={styles.hero}>
                        <span className={styles.eyebrow}>
                            <Sparkles size={15} />
                            PAINEL ADMINISTRATIVO
                        </span>

                        <h1>
                            Seu portfólio profissional{" "}
                            <em>sob seu controle.</em>
                        </h1>

                        <p>
                            Gerencie projetos, tecnologias, imagens e
                            informações profissionais em um ambiente moderno,
                            organizado e seguro.
                        </p>

                        <div className={styles.benefits}>
                            {benefits.map((benefit) => (
                                <span key={benefit}>
                                    <CheckCircle2 size={16} />
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.features}>
                        {features.map(
                            ({
                                icon: Icon,
                                title,
                                description,
                                variant,
                            }) => (
                                <article
                                    className={styles[variant]}
                                    key={title}
                                >
                                    <span className={styles.featureIcon}>
                                        <Icon size={22} />
                                    </span>

                                    <div>
                                        <strong>{title}</strong>
                                        <p>{description}</p>
                                    </div>

                                    <CheckCircle2
                                        className={styles.featureCheck}
                                        size={17}
                                    />
                                </article>
                            ),
                        )}
                    </div>

                    <div className={styles.databaseStatus}>
                        <span>
                            <Database size={18} />
                        </span>

                        <div>
                            <strong>Portfólio conectado</strong>
                            <small>PostgreSQL, Neon e Cloudinary</small>
                        </div>

                        <i />
                    </div>
                </div>
            </section>

            <section className={styles.loginArea}>
                <div className={styles.loginBackground} />
                <div className={styles.loginGlow} />

                <Link className={styles.backLink} href="/">
                    <ArrowLeft size={17} />
                    Voltar ao portfólio
                </Link>

                <div className={styles.loginContent}>
                    <div className={styles.mobileBrand}>
                        <span className={styles.logo}>
                            <Image
                                src="/images/brand/rick-pereira.png"
                                alt="Rick Pereira"
                                width={72}
                                height={72}
                                priority
                            />
                        </span>

                        <span>
                            <strong>Rick Pereira</strong>
                            <small>Painel administrativo</small>
                        </span>
                    </div>

                    <div className={styles.loginCard}>
                        <div className={styles.cardHighlight} />

                        <div className={styles.cardHeader}>
                            <span className={styles.securityIcon}>
                                <ShieldCheck size={26} />
                            </span>

                            <span className={styles.secureStatus}>
                                <i />
                                Ambiente seguro
                            </span>
                        </div>

                        <span className={styles.cardEyebrow}>
                            ACESSO RESTRITO
                        </span>

                        <h2>
                            Bem-vindo
                            <br />
                            novamente
                        </h2>

                        <p className={styles.description}>
                            Entre com seu e-mail e senha para gerenciar seu
                            portfólio profissional.
                        </p>

                        <LoginForm />

                        <div className={styles.securityText}>
                            <ShieldCheck size={15} />

                            <span>
                                Ambiente protegido e acesso exclusivo do
                                administrador.
                            </span>
                        </div>
                    </div>

                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Rick Pereira · Sistemas &
                        Aplicativos
                    </p>
                </div>
            </section>
        </main>
    );
}