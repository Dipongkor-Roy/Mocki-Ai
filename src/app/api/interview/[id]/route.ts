import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Make sure this interview exists and belongs to the signed-in user.
    const interview = await prisma.interview.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!interview || interview.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Report has a required 1:1 relation, so remove it first (MongoDB has no
    // automatic cascade), then the interview itself.
    await prisma.report.deleteMany({ where: { interviewId: id } });
    await prisma.interview.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("[DELETE_INTERVIEW]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
