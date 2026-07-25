import { useEffect, useMemo } from "react";

// FIX (#1 + #4 from the review): instead of one blank textarea asking
// "write your day-wise itinerary" — real work, reconstructed from
// memory, days after the trip — this lets a traveler add one entry per
// day: a photo (closer to how people already document trips in the
// moment) plus a single caption line. Because the parent form autosaves
// captions/day-numbers as the user types (files themselves can't
// persist — same browser limitation as the general media uploader),
// entries can genuinely be added incrementally across multiple sessions
// — add day 1 today, day 2 tomorrow — rather than all at once.
const DayLogJournal = ({ entries, onChange }) => {
  const nextDay = useMemo(
    () => (entries.length > 0 ? Math.max(...entries.map((e) => e.day || 0)) + 1 : 1),
    [entries],
  );

  const previews = useMemo(
    () => entries.map((e) => (e.file ? URL.createObjectURL(e.file) : e.imagePreviewUrl || null)),
    [entries],
  );

  useEffect(() => {
    return () => previews.forEach((url) => url && url.startsWith("blob:") && URL.revokeObjectURL(url));
  }, [previews]);

  const addEntry = () => {
    onChange([...entries, { day: nextDay, caption: "", file: null }]);
  };

  const updateEntry = (index, patch) => {
    onChange(entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const removeEntry = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border border-borderMain p-3 sm:flex-row sm:items-start">
            <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              {previews[index] ? (
                <img src={previews[index]} alt={`Day ${entry.day}`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-400">📷</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => updateEntry(index, { file: e.target.files[0] || null })}
              />
            </label>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500">Day</label>
                <input
                  type="number"
                  min={1}
                  value={entry.day}
                  onChange={(e) => updateEntry(index, { day: Number(e.target.value) })}
                  className="w-16 rounded-lg border border-borderMain px-2 py-1 text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="What happened this day? (one line is fine)"
                value={entry.caption}
                onChange={(e) => updateEntry(index, { caption: e.target.value })}
                className="w-full rounded-lg border border-borderMain px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeEntry(index)}
              className="self-start text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEntry}
        className="mt-4 rounded-xl border border-dashed border-blue-400 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        + Add a day
      </button>

      <p className="mt-3 text-xs text-gray-400">
        Add one whenever you remember something — during the trip or after. Your captions and day
        numbers are saved as you type; you'll just need to re-attach photos if you come back later.
      </p>
    </div>
  );
};

export default DayLogJournal;