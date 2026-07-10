"use client";

import { useState } from "react";
import type { CVData } from "@/lib/cv/extract-with-gemini";

interface CVDataPreviewProps {
  cvData: CVData;
  onSave: (updatedData: CVData) => void;
  onRemove?: () => void;
  isLoading?: boolean;
}

export default function CVDataPreview({
  cvData,
  onSave,
  onRemove,
  isLoading = false,
}: CVDataPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CVData>(cvData);

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(cvData);
    setIsEditing(false);
  };

  const handleChange = (field: keyof CVData, value: unknown) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    handleChange("skills", skills);
  };

  const handleJobTitlesChange = (value: string) => {
    const titles = value
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    handleChange("jobTitles", titles);
  };

  if (!isEditing) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Extracted CV Data
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Review and edit your extracted information
            </p>
          </div>
          <div className="flex gap-2">
            {onRemove && (
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                🗑️ Remove
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
              Full Name
            </p>
            <p className="text-sm font-medium text-gray-900">{editedData.name}</p>
          </div>

          {/* Email */}
          {editedData.email && (
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {editedData.email}
              </p>
            </div>
          )}

          {/* Phone */}
          {editedData.phone && (
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-900">
                {editedData.phone}
              </p>
            </div>
          )}

          {/* Experience Years */}
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
              Experience
            </p>
            <p className="text-sm font-medium text-gray-900">
              {editedData.experienceYears} year
              {editedData.experienceYears !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Current Role */}
          {editedData.currentRole && (
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                Current Role
              </p>
              <p className="text-sm font-medium text-gray-900">
                {editedData.currentRole}
              </p>
            </div>
          )}

          {/* Industry */}
          {editedData.industry && (
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
                Industry
              </p>
              <p className="text-sm font-medium text-gray-900">
                {editedData.industry}
              </p>
            </div>
          )}

          {/* Education */}
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1">
              Education
            </p>
            <p className="text-sm font-medium text-gray-900">
              {editedData.education}
            </p>
          </div>
        </div>

        {/* Skills */}
        {editedData.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-3">
              Skills ({editedData.skills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {editedData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Titles */}
        {editedData.jobTitles && editedData.jobTitles.length > 0 && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-3">
              Previous Job Titles
            </p>
            <div className="space-y-1">
              {editedData.jobTitles.map((title) => (
                <p
                  key={title}
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-indigo-500">•</span> {title}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 bg-white p-4 rounded-lg border border-indigo-100">
          <p className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
            Professional Summary
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {editedData.summary}
          </p>
        </div>
      </div>
    );
  }

  // Edit Mode
  const inputClass =
    "w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  return (
    <div className="rounded-2xl bg-white border border-gray-200 flex flex-col max-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit CV Data</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Make corrections to ensure accuracy for personalized interviews
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5 overflow-y-auto">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={editedData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={editedData.email || ""}
              onChange={(e) => handleChange("email", e.target.value || null)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={editedData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value || null)}
              className={inputClass}
              placeholder="optional"
            />
          </div>
          <div>
            <label className={labelClass}>Years of Experience</label>
            <input
              type="number"
              value={editedData.experienceYears}
              onChange={(e) =>
                handleChange("experienceYears", parseInt(e.target.value) || 0)
              }
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Current Role</label>
            <input
              type="text"
              value={editedData.currentRole || ""}
              onChange={(e) =>
                handleChange("currentRole", e.target.value || null)
              }
              className={inputClass}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <label className={labelClass}>Industry / Domain</label>
            <input
              type="text"
              value={editedData.industry || ""}
              onChange={(e) =>
                handleChange("industry", e.target.value || null)
              }
              className={inputClass}
              placeholder="e.g., Software Engineering"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Education</label>
            <input
              type="text"
              value={editedData.education}
              onChange={(e) => handleChange("education", e.target.value)}
              className={inputClass}
              placeholder="e.g., B.Tech Computer Science"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className={labelClass}>Skills (comma-separated)</label>
          <textarea
            value={editedData.skills.join(", ")}
            onChange={(e) => handleSkillsChange(e.target.value)}
            rows={2}
            className={`${inputClass} font-mono resize-none`}
            placeholder="React, Node.js, Python, Leadership, Problem Solving"
          />
        </div>

        {/* Job Titles */}
        <div>
          <label className={labelClass}>Job Titles (comma-separated)</label>
          <textarea
            value={editedData.jobTitles?.join(", ") || ""}
            onChange={(e) => handleJobTitlesChange(e.target.value)}
            rows={2}
            className={`${inputClass} font-mono resize-none`}
            placeholder="Software Engineer, Senior Developer, Tech Lead"
          />
        </div>

        {/* Summary */}
        <div>
          <label className={labelClass}>Professional Summary</label>
          <textarea
            value={editedData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}
