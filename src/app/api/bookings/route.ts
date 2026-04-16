import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, bookingConfirmClient, bookingNotifyAdmin } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  goal: z.string().max(500).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  consent: z.literal(true)
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = bookingSchema.parse(json);

    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.active) {
      return NextResponse.json({ error: "Prestation introuvable" }, { status: 404 });
    }

    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);
    if (startsAt < new Date()) {
      return NextResponse.json({ error: "Créneau passé" }, { status: 400 });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt }
      }
    });
    if (conflict) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId: service.id,
        startsAt,
        endsAt,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        goal: data.goal ?? null,
        message: data.message ?? null,
        status: "PENDING"
      }
    });

    const adminEmails = (process.env.ADMIN_EMAILS || "contact@elodieduhayon.ch")
      .split(",")
      .map((s) => s.trim());

    Promise.all([
      sendEmail({
        to: booking.email,
        subject: "Ta demande de réservation est bien reçue ✨",
        html: bookingConfirmClient({
          firstName: booking.firstName,
          serviceName: service.name,
          startsAt: booking.startsAt
        })
      }),
      sendEmail({
        to: adminEmails,
        subject: `Nouvelle demande — ${booking.firstName} ${booking.lastName}`,
        replyTo: booking.email,
        html: bookingNotifyAdmin({
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone,
          serviceName: service.name,
          startsAt: booking.startsAt,
          goal: booking.goal,
          message: booking.message
        })
      })
    ]).catch((err) => console.error("Email error:", err));

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      const fieldLabels: Record<string, string> = {
        serviceId: "Prestation",
        startsAt: "Date de début",
        endsAt: "Date de fin",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        goal: "Objectif",
        message: "Message",
        consent: "Consentement RGPD"
      };
      const messages = (err.issues as any[]).map((issue: any) => {
        const field = issue.path?.[0];
        const label = fieldLabels[field] || field || "Champ";
        if (issue.code === "too_small") return `${label} : minimum ${issue.minimum} caractères`;
        if (issue.code === "too_big") return `${label} : maximum ${issue.maximum} caractères`;
        if (issue.code === "invalid_string" && issue.validation === "email") return `${label} : adresse email invalide`;
        if (issue.code === "invalid_string" && issue.validation === "datetime") return `${label} : format de date invalide`;
        if (issue.code === "invalid_literal") return `${label} : requis`;
        return `${label} : ${issue.message}`;
      });
      return NextResponse.json({ error: messages.join(" · "), issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = {};
  if (status) where.status = status;
  if (from || to) {
    where.startsAt = {};
    if (from) where.startsAt.gte = new Date(from);
    if (to) where.startsAt.lte = new Date(to);
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { service: true },
    orderBy: { startsAt: "desc" },
    take: 500
  });
  return NextResponse.json({ bookings });
}
