import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, contactNotifyAdmin } from "@/lib/email";

const contactSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().max(80).optional().nullable(),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  message: z.string().min(5).max(3000),
  consent: z.literal(true),
  honeypot: z.string().max(0).optional() // anti-spam
});

export async function POST(req: NextRequest) {
  try {
    const data = contactSchema.parse(await req.json());

    const msg = await prisma.contactMessage.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName ?? null,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message
      }
    });

    const adminEmails = (process.env.ADMIN_EMAILS || "contact@elodieduhayon.ch")
      .split(",")
      .map((s) => s.trim());

    sendEmail({
      to: adminEmails,
      replyTo: msg.email,
      subject: `Nouveau message — ${msg.firstName}`,
      html: contactNotifyAdmin({
        firstName: msg.firstName,
        lastName: msg.lastName,
        email: msg.email,
        message: msg.message
      })
    }).catch((err) => console.error("Email error:", err));

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
