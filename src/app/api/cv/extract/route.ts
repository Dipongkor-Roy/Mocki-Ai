import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { extractCVData } from "@/lib/cv/extract-with-gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: "Text is too short to extract CV data" },
        { status: 400 },
      );
    }

    const cvData = await extractCVData(text);

    return NextResponse.json({ success: true, cvData });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Extraction failed";
    console.error("[CV_EXTRACT]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
