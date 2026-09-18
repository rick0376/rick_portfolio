// src/components/admin/SettingsForm/SettingsForm.tsx

"use client";

import {
    BriefcaseBusiness,
    CheckCircle2,
    ExternalLink,
    FileText,
    Github,
    Linkedin,
    LoaderCircle,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Save,
    Settings2,
    UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";

import styles from "./styles.module.scss";

export type SettingsFormData = {
    professionalName: string;
    brandName: string;
    headline: string;
    biography: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    linkedinUrl: string;
    githubUrl: string;
    curriculumUrl: string;
    availabilityText: string;
};

type SettingsFormProps = {
    initialData: SettingsFormData;
};

export default function SettingsForm({
    initialData,
}: SettingsFormProps) {
    const [formData, setFormData] =
        useState<SettingsFormData>(initialData);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    function updateField(
        field: keyof SettingsFormData,
        value: string,
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setSuccess(false);

        try {
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Não foi possível salvar as configurações.",
                );
            }

            setSuccess(true);
            setMessage(
                data.message ||
                "Configurações atualizadas com sucesso.",
            );
        } catch (error) {
            setSuccess(false);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível salvar as configurações.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <header className={styles.pageHeader}>
                <div>
                    <span className={styles.eyebrow}>
                        <Settings2 size={14} />
                        Configurações do portfólio
                    </span>

                    <h1>Informações profissionais</h1>

                    <p>
                        Atualize sua identidade, contatos, redes sociais e
                        currículo em um único lugar.
                    </p>
                </div>

                <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={saving}
                >
                    {saving ? (
                        <LoaderCircle
                            className={styles.spin}
                            size={18}
                        />
                    ) : (
                        <Save size={18} />
                    )}

                    {saving ? "Salvando..." : "Salvar alterações"}
                </button>
            </header>

            {message && (
                <div
                    className={`${styles.message} ${success ? styles.success : styles.error
                        }`}
                >
                    {success && <CheckCircle2 size={19} />}
                    {message}
                </div>
            )}

            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <div className={styles.cardHeading}>
                            <span>
                                <UserRound size={21} />
                            </span>

                            <div>
                                <h2>Identidade profissional</h2>
                                <p>
                                    Dados principais apresentados no portfólio.
                                </p>
                            </div>
                        </div>

                        <div className={styles.fields}>
                            <label>
                                <span>Nome profissional</span>
                                <input
                                    value={formData.professionalName}
                                    onChange={(event) =>
                                        updateField(
                                            "professionalName",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Luis Henrique Pereira"
                                    required
                                />
                            </label>

                            <label>
                                <span>Nome da marca</span>
                                <input
                                    value={formData.brandName}
                                    onChange={(event) =>
                                        updateField(
                                            "brandName",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Rick Pereira"
                                    required
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span>Título profissional</span>
                                <input
                                    value={formData.headline}
                                    onChange={(event) =>
                                        updateField(
                                            "headline",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Portfólio, Currículo e Projetos"
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span>Biografia</span>
                                <textarea
                                    value={formData.biography}
                                    onChange={(event) =>
                                        updateField(
                                            "biography",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Conte resumidamente sua experiência profissional."
                                    rows={5}
                                />
                            </label>

                            <label className={styles.fullField}>
                                <span>Mensagem de disponibilidade</span>
                                <input
                                    value={formData.availabilityText}
                                    onChange={(event) =>
                                        updateField(
                                            "availabilityText",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Disponível para novos projetos"
                                />
                            </label>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeading}>
                            <span>
                                <MessageCircle size={21} />
                            </span>

                            <div>
                                <h2>Contatos</h2>
                                <p>
                                    Campos vazios não serão exibidos no site.
                                </p>
                            </div>
                        </div>

                        <div className={styles.fields}>
                            <label>
                                <span>
                                    <Mail size={15} />
                                    E-mail
                                </span>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(event) =>
                                        updateField("email", event.target.value)
                                    }
                                    placeholder="contato@rickpereira.dev"
                                />
                            </label>

                            <label>
                                <span>
                                    <Phone size={15} />
                                    Telefone
                                </span>

                                <input
                                    value={formData.phone}
                                    onChange={(event) =>
                                        updateField("phone", event.target.value)
                                    }
                                    placeholder="(12) 99999-9999"
                                />
                            </label>

                            <label>
                                <span>
                                    <MessageCircle size={15} />
                                    WhatsApp
                                </span>

                                <input
                                    value={formData.whatsapp}
                                    onChange={(event) =>
                                        updateField(
                                            "whatsapp",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="5512999999999"
                                />

                                <small>
                                    Informe o código do país, DDD e número.
                                </small>
                            </label>

                            <label>
                                <span>
                                    <MapPin size={15} />
                                    Localização
                                </span>

                                <input
                                    value={formData.location}
                                    onChange={(event) =>
                                        updateField(
                                            "location",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="São Paulo, SP"
                                />
                            </label>
                        </div>
                    </section>
                </div>

                <aside className={styles.sideColumn}>
                    <section className={styles.card}>
                        <div className={styles.cardHeading}>
                            <span>
                                <BriefcaseBusiness size={21} />
                            </span>

                            <div>
                                <h2>Redes profissionais</h2>
                                <p>Links externos do seu perfil.</p>
                            </div>
                        </div>

                        <div className={styles.sideFields}>
                            <label>
                                <span>
                                    <Linkedin size={15} />
                                    LinkedIn
                                </span>

                                <input
                                    type="url"
                                    value={formData.linkedinUrl}
                                    onChange={(event) =>
                                        updateField(
                                            "linkedinUrl",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://linkedin.com/in/seu-perfil"
                                />
                            </label>

                            <label>
                                <span>
                                    <Github size={15} />
                                    GitHub
                                </span>

                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(event) =>
                                        updateField(
                                            "githubUrl",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://github.com/seu-usuario"
                                />
                            </label>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeading}>
                            <span>
                                <FileText size={21} />
                            </span>

                            <div>
                                <h2>Currículo</h2>
                                <p>Arquivo público ou endereço externo.</p>
                            </div>
                        </div>

                        <div className={styles.sideFields}>
                            <label>
                                <span>
                                    <ExternalLink size={15} />
                                    Link do currículo
                                </span>

                                <input
                                    value={formData.curriculumUrl}
                                    onChange={(event) =>
                                        updateField(
                                            "curriculumUrl",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="/curriculo.pdf"
                                />

                                <small>
                                    Pode usar `/curriculo.pdf` ou uma URL completa.
                                </small>
                            </label>
                        </div>
                    </section>

                    <section className={styles.tipCard}>
                        <span>
                            <CheckCircle2 size={20} />
                        </span>

                        <div>
                            <strong>Atualização centralizada</strong>
                            <p>
                                As alterações serão utilizadas na página
                                principal, contatos e rodapé.
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </form>
    );
}