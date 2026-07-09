"use client";

import { useState } from "react";
import type { CVData } from "@/lib/cv/extract-with-gemini";

interface CVDataPreviewProps {
  cvData: CVData;
  onSave: (updatedData: CVData) => void;
  isLoading?: boolean;
}

export default function CVDataPreview({
  cvData,
  onSave,
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
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ✏️ Edit
          </button>
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
  return (
    <div className="rounded-2xl bg-white p-6 border border-red-100 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Edit CV Data
        </h3>
        <p className="text-sm text-gray-600">
          Make corrections to ensure accuracy for personalized interviews
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={editedData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={editedData.email || ""}
          onChange={(e) => handleChange("email", e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="optional"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={editedData.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="optional"
        />
      </div>

      {/* Experience Years */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience
        </label>
        <input
          type="number"
          value={editedData.experienceYears}
          onChange={(e) => handleChange("experienceYears", parseInt(e.target.value) || 0)}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Current Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Role
        </label>
        <input
          type="text"
          value={editedData.currentRole || ""}
          onChange={(e) => handleChange("currentRole", e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry / Domain
        </label>
        <input
          type="text"
          value={editedData.industry || ""}
          onChange={(e) => handleChange("industry", e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., Software Engineering, Finance, Healthcare"
        />
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education
        </label>
        <input
          type="text"
          value={editedData.education}
          onChange={(e) => handleChange("education", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., B.Tech Computer Science"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills (comma-separated)
        </label>
        <textarea
          value={editedData.skills.join(", ")}
          onChange={(e) => handleSkillsChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          placeholder="React, Node.js, Python, Leadership, Problem Solving"
        />
      </div>

      {/* Job Titles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Titles (comma-separated)
        </label>
        <textarea
          value={editedData.jobTitles?.join(", ") || ""}
          onChange={(e) => handleJobTitlesChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          placeholder="Software Engineer, Senior Developer, Tech Lead"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={editedData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
