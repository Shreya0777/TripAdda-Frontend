import { useState } from "react";

// FIX (UX): fields like mustTryFoods, cafes, tags, transportTips were
// plain textareas asking the user to type "comma separated" values —
// no visual confirmation of what got added, and no safe way to include
// a comma inside an item itself. This gives instant visual feedback
// (chips) and stores the value as a real array, so the old
// convertToArray(value.split(",")) step at submit time is gone entirely.
const TagInput = ({ label, name, value = [], onChange, placeholder, error }) => {
  const [draft, setDraft] = useState("");

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange({ target: { name, value: [...value, trimmed] } });
    }
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange({ target: { name, value: value.slice(0, -1) } });
    }
  };

  const removeAt = (index) => {
    onChange({ target: { name, value: value.filter((_, i) => i !== index) } });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="text-blue-400 hover:text-blue-700"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 border-none bg-transparent py-1 text-sm text-gray-900 outline-none placeholder-gray-400"
        />
      </div>

      <p className="mt-1 text-xs text-gray-400">Press Enter or comma to add</p>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TagInput;
