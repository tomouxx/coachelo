import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearSettingsCache } from "@/lib/settings";

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  category: z.string().optional(),
  label: z.string().optional(),
  type: z.string().optional()
});

/**
 * GET /api/settings
 * Returns all settings or filtered by category.
 * Public endpoint - no auth required (pages need to read settings).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where = category ? { category } : {};
    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: { sortOrder: "asc" }
    });

    const formatted = settings.map((s) => ({
      key: s.key,
      value: s.value,
      category: s.category,
      label: s.label,
      type: s.type,
      sortOrder: s.sortOrder,
      updatedAt: s.updatedAt
    }));

    return NextResponse.json({ settings: formatted });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings
 * Update a single setting (requires admin auth).
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = updateSchema.parse(await req.json());

    const updated = await prisma.siteSetting.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        ...(data.label && { label: data.label }),
        ...(data.type && { type: data.type }),
        ...(data.category && { category: data.category })
      },
      create: {
        key: data.key,
        value: data.value,
        category: data.category || "general",
        label: data.label || "",
        type: data.type || "text"
      }
    });

    // Clear cache so updated settings are fetched on next request
    clearSettingsCache();

    return NextResponse.json({
      setting: {
        key: updated.key,
        value: updated.value,
        category: updated.category,
        label: updated.label,
        type: updated.type,
        updatedAt: updated.updatedAt
      }
    });
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

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
      const setting = await prisma.siteSetting.upsert({
        where: { key: update.key },
        update: {
          value: update.value,
          ...(update.label && { label: update.label }),
          ...(update.type && { type: update.type }),
          ...(update.category && { category: update.category })
        },
        create: {
          key: update.key,
          value: update.value,
          category: update.category || "general",
          label: update.label || "",
          type: update.type || "text"
        }
      });
      results.push(setting);
    }

    // Clear cache after batch update
    clearSettingsCache();

    return NextResponse.json({ settings: results });
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }
    console.error("Error batch updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
