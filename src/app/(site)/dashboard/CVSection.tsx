"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import CVDataPreview from "./CVDataPreview";
import type { CVData } from "@/lib/cv/extract-with-gemini";

export default function CVSection({
  cvData,
  onCvDataChange,
}: {
  cvData: CVData | null;
  onCvDataChange: (cvData: CVData | null) => void;
}) {
  const setCvData = onCvDataChange;
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
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
      setShowPreview(true);
      toast.success("CV analyzed! Please review the extracted data.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveCVData(updatedData: CVData) {
    setSaving(true);
    try {
      const res = await fetch("/api/cv/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }
      setCvData(updatedData);
      setShowPreview(false);
      toast.success("CV data saved successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveCVData() {
    setRemoving(true);
    try {
      const res = await fetch("/api/cv/save-data", { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove");
      }
      setCvData(null);
      setShowPreview(false);
      setShowRemoveModal(false);
      toast.success("CV data removed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setRemoving(false);
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

  const removeModal = (
    <RemoveCVModal
      open={showRemoveModal}
      isRemoving={removing}
      onCancel={() => setShowRemoveModal(false)}
      onConfirm={handleRemoveCVData}
    />
  );

  if (cvData && showPreview) {
    return (
      <>
        <CVDataPreview
          cvData={cvData}
          onSave={handleSaveCVData}
          onRemove={() => setShowRemoveModal(true)}
          isLoading={saving}
        />
        {removeModal}
      </>
    );
  }

  if (cvData) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 transition-all">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your CV</h2>
            <p className="text-xs text-gray-500 mt-1">
              Profile information from your resume
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              📋 View Details
            </button>
            <button
              onClick={triggerInput}
              disabled={uploading}
              className="px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Uploading..." : "Re-upload"}
            </button>
            {hiddenInput}
          </div>
        </div>
        <div className="space-y-5">
          {/* Main Details Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoRow label="Full Name" value={cvData.name} />
            {cvData.currentRole && (
              <InfoRow label="Current Role" value={cvData.currentRole} />
            )}
            <InfoRow
              label="Experience"
              value={`${cvData.experienceYears} year${cvData.experienceYears !== 1 ? "s" : ""}`}
            />
            <InfoRow label="Education" value={cvData.education} />
            {cvData.email && <InfoRow label="Email" value={cvData.email} />}
            {cvData.industry && (
              <InfoRow label="Industry" value={cvData.industry} />
            )}
          </div>

          {/* Skills Section */}
          {cvData.skills.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide font-semibold text-gray-600">
                Top Skills ({cvData.skills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.slice(0, 12).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary Section */}
          {cvData.summary && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide font-semibold text-gray-600">
                Professional Summary
              </p>
              <p className="text-sm leading-relaxed text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {cvData.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:h-full flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 transition-all">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Upload Your CV</h2>
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll analyze your resume to tailor interview questions
        </p>
      </div>
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
        className="flex flex-1 min-h-[280px] lg:min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 px-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 bg-gradient-to-br from-white to-gray-50"
      >
        {uploading ? (
          <>
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-semibold text-indigo-600">
              Analyzing your CV...
            </p>
            <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
          </>
        ) : (
          <>
            <div className="mb-4 text-4xl opacity-60">📄</div>
            <p className="text-sm font-semibold text-gray-800">
              Drop your CV here or click to browse
            </p>
            <p className="mt-2 text-xs text-gray-500">
              PDF or Word document · Max 5MB
            </p>
            <div className="mt-4 text-xs text-gray-400">
              We support: .pdf, .doc, .docx
            </div>
          </>
        )}
      </div>
      {hiddenInput}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
      <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-1.5">{value}</p>
    </div>
  );
}

function RemoveCVModal({
  open,
  isRemoving,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  isRemoving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <span className="text-2xl">🗑️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Remove your CV?</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          This will permanently delete your extracted CV data. You&apos;ll need
          to upload your CV again to start a personalized interview.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isRemoving}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRemoving}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemoving ? "Removing..." : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
