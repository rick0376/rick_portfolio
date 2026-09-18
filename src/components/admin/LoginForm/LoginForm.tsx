// src/components/admin/LoginForm/LoginForm.tsx

"use client";

import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    LogIn,
    Mail,
} from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
    loginAction,
    type LoginActionState,
} from "@/actions/auth";

import styles from "./styles.module.scss";

const initialState: LoginActionState = {
    error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className={styles.submitButton}
            type="submit"
            disabled={pending}
        >
            <span>
                {pending ? (
                    <LoaderCircle
                        className={styles.spinner}
                        size={19}
                    />
                ) : (
                    <LogIn size={19} />
                )}
            </span>

            {pending ? "Entrando..." : "Entrar no painel"}
        </button>
    );
}

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction] = useActionState(
        loginAction,
        initialState,
    );

    return (
        <form className={styles.form} action={formAction}>
            <div className={styles.field}>
                <label htmlFor="email">E-mail</label>

                <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                        <Mail size={18} />
                    </span>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        autoComplete="email"
                        required
                    />
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.labelRow}>
                    <label htmlFor="password">Senha</label>
                    <span>Acesso administrativo</span>
                </div>

                <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}>
                        <LockKeyhole size={18} />
                    </span>

                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        required
                    />

                    <button
                        className={styles.passwordButton}
                        type="button"
                        onClick={() =>
                            setShowPassword((current) => !current)
                        }
                        aria-label={
                            showPassword
                                ? "Ocultar senha"
                                : "Mostrar senha"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
            </div>

            {state.error && (
                <div className={styles.error} role="alert">
                    {state.error}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}