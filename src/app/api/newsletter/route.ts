import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email()
});

export async function POST(req: NextRequest) {
  try {
    let body: any;
    const contentType = req.headers.get("content-type") || "";

    // Support both JSON and form-encoded (from the footer form)
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = { email: formData.get("email") };
    }

    const { email } = schema.parse(body);

    // Save to local DB
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { unsubscribed: false, consent: true },
      create: { email, consent: true }
    });

    // Sync to Brevo if configured
    if (process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID) {
      try {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            email,
            listIds: [Number(process.env.BREVO_LIST_ID)],
            updateEnabled: true
          })
        });
      } catch (brevoErr) {
        console.error("Brevo sync error:", brevoErr);
        // Don't fail the request — local DB is saved
      }
    }

    // Redirect back for form submissions, JSON response for API calls
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/?newsletter=ok", req.url), 303);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL("/?newsletter=error", req.url), 303);
      }
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
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

  // Unsubscribe from Brevo too
  if (process.env.BREVO_API_KEY) {
    try {
      await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailBlacklisted: true })
      });
    } catch {
      // Silent fail
    }
  }

  return NextResponse.json({ ok: true });
}
