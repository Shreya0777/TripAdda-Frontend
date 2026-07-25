import { useState } from "react";

// FIX (UX): the old form used a plain number <input> for every rating
// field ("Overall Rating", "Budget Rating", etc.) with no indication
// that valid values are 1-5 — a user could type 10 and only find out
// it was wrong after the server rejected the whole submission. A star
// picker makes the valid range self-evident and removes an entire
// class of "why did this fail" confusion.
const StarRating = ({ label, name, value, onChange, error, required = false }) => {
  const [hovered, setHovered] = useState(0);
  const current = Number(value) || 0;

  const handleSelect = (star) => {
    onChange({ target: { name, value: star } });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || current);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={current === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleSelect(star)}
              className={`text-2xl leading-none transition ${
                filled ? "text-yellow-400" : "text-gray-300"
              } hover:scale-110`}
            >
              ★
            </button>
          );
        })}
        {current > 0 && (
          <span className="ml-2 text-sm text-gray-500">{current}/5</span>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default StarRating;
