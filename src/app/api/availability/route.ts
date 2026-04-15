import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const duration = Number(searchParams.get("duration") || 60);
  if (!dateStr) return NextResponse.json({ error: "Missing date" }, { status: 400 });
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return NextResponse.json({ error: "Bad date" }, { status: 400 });
  const slots = await getAvailableSlots(date, duration);
  return NextResponse.json({
    slots: slots.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() }))
  });
}
