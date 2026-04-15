import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  consent: z.literal(true)
});

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json());
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { unsubscribed: false, consent: true },
      create: { email, consent: true }
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email manquant" }, { status: 400 });
  await prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: { unsubscribed: true }
  });
  return NextResponse.json({ ok: true });
}
