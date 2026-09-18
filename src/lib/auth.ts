// src/lib/auth.ts

import { compare } from "bcryptjs";
import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type AuthenticatedAdmin = {
    id: string;
    name: string;
    email: string;
};

export async function authenticateAdmin(
    email: string,
    password: string,
): Promise<AuthenticatedAdmin | null> {
    const normalizedEmail = email.toLowerCase().trim();

    const admin = await prisma.adminUser.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (!admin || !admin.active) {
        return null;
    }

    const passwordIsValid = await compare(password, admin.passwordHash);

    if (!passwordIsValid) {
        return null;
    }

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
    };
}

export const getCurrentAdmin = cache(
    async (): Promise<AuthenticatedAdmin | null> => {
        const session = await getSession();

        if (!session) {
            return null;
        }

        const admin = await prisma.adminUser.findUnique({
            where: {
                id: session.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                active: true,
            },
        });

        if (!admin || !admin.active) {
            return null;
        }

        return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
        };
    },
);

export async function requireAdmin() {
    const admin = await getCurrentAdmin();

    if (!admin) {
        redirect("/admin/login");
    }

    return admin;
}