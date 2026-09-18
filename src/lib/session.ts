// src/lib/session.ts

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7;

export type SessionPayload = {
    userId: string;
    name: string;
    email: string;
};

function getSessionSecret() {
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
        throw new Error("A variável SESSION_SECRET não foi configurada.");
    }

    return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

    const token = await new SignJWT({
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
    })
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(getSessionSecret());

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, getSessionSecret());

        if (
            typeof payload.userId !== "string" ||
            typeof payload.name !== "string" ||
            typeof payload.email !== "string"
        ) {
            return null;
        }

        return {
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
        };
    } catch {
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);
}