import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cvData: CVData = await req.json();

    // Validate required fields
    if (!cvData.name || !cvData.education || !cvData.summary) {
      return NextResponse.json(
        { error: "Missing required fields (name, education, summary)" },
        { status: 400 },
      );
    }

    // Update user's CV data
    await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        cvData: cvData,
      },
    });

    return NextResponse.json({ success: true, cvData });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[CV_SAVE_DATA]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
