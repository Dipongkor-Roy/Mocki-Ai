import { notFound } from "next/navigation";
import InterviewPreviewClient from "./InterviewPreviewClient";

// Preview route for the Interview Room UI with dummy data. Returns 404 in
// production so it can never ship live.
export default function InterviewPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <InterviewPreviewClient />;
}
