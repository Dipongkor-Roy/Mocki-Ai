import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCVFile } from "@/lib/cv/parse-pdf";
import { extractCVData } from "@/lib/cv/extract-with-gemini";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("cv") as File | null;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 },
      );

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type))
      return NextResponse.json(
        { error: "Only PDF or DOCX allowed" },
        { status: 400 },
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawText = await parseCVFile(buffer, file.type);

    if (!rawText.trim())
      return NextResponse.json(
        { error: "Could not read text from this file" },
        { status: 400 },
      );

    const cvData = await extractCVData(rawText);

    await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        cvMarkdown: rawText,
        cvData: cvData,
        cvUploadedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, cvData });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[CV_UPLOAD]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
