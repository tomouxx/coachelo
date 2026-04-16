import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearSettingsCache } from "@/lib/settings";

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.string()
});

/**
 * POST /api/settings/batch
 * Update multiple settings at once (requires admin auth).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updates = z.array(updateSchema).parse(body);

    const results = [];
    for (const update of updates) {
      const setting = await prisma.siteSetting.update({
        where: { key: update.key },
        data: { value: update.value }
      });
      results.push(setting);
    }

    clearSettingsCache();

    return NextResponse.json({ settings: results });
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Error batch updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
