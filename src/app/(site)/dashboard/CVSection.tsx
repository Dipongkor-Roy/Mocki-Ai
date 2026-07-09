"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export default function CVSection({
  initialCvData,
}: {
  initialCvData: CVData | null;
}) {
  const [cvData, setCvData] = useState<CVData | null>(initialCvData);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("cv", file);
    try {
      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCvData(data.cvData);
      toast.success("CV analyzed!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const triggerInput = () => fileRef.current?.click();

  const hiddenInput = (
    <input
      ref={fileRef}
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        e.target.value = "";
      }}
    />
  );

  if (cvData) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your CV</h2>
          <button
            onClick={triggerInput}
            disabled={uploading}
            className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Re-upload"}
          </button>
          {hiddenInput}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoRow label="Name" value={cvData.name} />
          {cvData.currentRole && (
            <InfoRow label="Role" value={cvData.currentRole} />
          )}
          <InfoRow
            label="Experience"
            value={`${cvData.experienceYears} yr(s)`}
          />
          <InfoRow label="Education" value={cvData.education} />
          {cvData.email && <InfoRow label="Email" value={cvData.email} />}
        </div>
        {cvData.skills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {cvData.summary && (
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            {cvData.summary}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Upload Your CV
      </h2>
      <div
        role="button"
        tabIndex={0}
        onClick={triggerInput}
        onKeyDown={(e) => e.key === "Enter" && triggerInput()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 transition hover:border-indigo-300 hover:bg-indigo-50/30"
      >
        {uploading ? (
          <>
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-medium text-indigo-600">
              Analyzing your CV...
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">
              Drop your CV here or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-400">PDF or DOCX · Max 5MB</p>
          </>
        )}
      </div>
      {hiddenInput}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
