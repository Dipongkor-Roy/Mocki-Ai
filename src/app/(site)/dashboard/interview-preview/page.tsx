import { notFound } from "next/navigation";
import InterviewPreviewClient from "./InterviewPreviewClient";

// Dev-only route to preview the Interview Room UI without running the real
// interview flow. Returns 404 in production so it can never ship live.
export default function InterviewPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <InterviewPreviewClient />;
}
