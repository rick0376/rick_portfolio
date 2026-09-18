// src/actions/auth.ts

"use server";

import { redirect } from "next/navigation";

import { authenticateAdmin } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";

export type LoginActionState = {
    error: string | null;
};

export async function loginAction(
    _previousState: LoginActionState,
    formData: FormData,
): Promise<LoginActionState> {
    const email = String(formData.get("email") ?? "")
        .toLowerCase()
        .trim();

    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
        return {
            error: "Informe seu e-mail e sua senha.",
        };
    }

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
        return {
            error: "E-mail ou senha inválidos.",
        };
    }

    await createSession({
        userId: admin.id,
        name: admin.name,
        email: admin.email,
    });

    redirect("/admin");
}

export async function logoutAction() {
    await deleteSession();

    redirect("/admin/login");
}