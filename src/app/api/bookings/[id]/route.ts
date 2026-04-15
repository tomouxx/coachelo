import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, bookingConfirmClient } from "@/lib/email";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  notes: z.string().max(2000).optional().nullable()
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { service: true }
  });
  if (!booking) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const data = updateSchema.parse(await req.json());
    const existing = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { service: true }
    });
    if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data,
      include: { service: true }
    });

    // Envoi d'un email de confirmation au client si le statut passe à CONFIRMED
    if (data.status === "CONFIRMED" && existing.status !== "CONFIRMED") {
      sendEmail({
        to: booking.email,
        subject: "Ta séance est confirmée 🌸",
        html: bookingConfirmClient({
          firstName: booking.firstName,
          serviceName: booking.service.name,
          startsAt: booking.startsAt
        })
      }).catch((err) => console.error("Email error:", err));
    }

    return NextResponse.json({ booking });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
