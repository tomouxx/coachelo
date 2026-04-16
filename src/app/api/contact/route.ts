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
  consent: z.preprocess((v) => v === true || v === "on" || v === "true", z.literal(true)),
  honeypot: z.string().max(0).optional() // anti-spam
});

async function parseBody(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return req.json();
  }
  // HTML form: application/x-www-form-urlencoded
  const form = await req.formData();
  const obj: Record<string, string> = {};
  form.forEach((v, k) => {
    obj[k] = v.toString();
  });
  return obj;
}

export async function POST(req: NextRequest) {
  const isForm = !(req.headers.get("content-type") || "").includes("application/json");

  try {
    const raw = await parseBody(req);
    const data = contactSchema.parse(raw);

    const msg = await prisma.contactMessage.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName ?? null,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message
      }
    });

    const adminEmails = (process.env.ADMIN_EMAILS || "contact@coachelo.ch")
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

    if (isForm) {
      return NextResponse.redirect(new URL("/contact?success=1", req.url), 303);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      if (isForm) {
        return NextResponse.redirect(new URL("/contact?error=validation", req.url), 303);
      }
      return NextResponse.json({ error: "Données invalides", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    if (isForm) {
      return NextResponse.redirect(new URL("/contact?error=serveur", req.url), 303);
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
