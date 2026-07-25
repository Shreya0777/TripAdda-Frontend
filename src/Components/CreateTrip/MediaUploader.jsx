import { useEffect, useMemo } from "react";

// FIX (UX): the old media section showed only a filename per selected
// file and gave zero feedback once "Publish" was clicked — no thumbnail,
// no upload progress, no sense of whether a slow connection was still
// working or stuck. This adds thumbnail/video previews immediately on
// selection, and the parent (CreateTrip) now tracks real upload
// percentage via axios' onUploadProgress instead of a static "Publishing…" label.
const MediaUploader = ({ media, onAdd, onRemove, error }) => {
  // Object URLs for instant local previews — revoked on unmount/change
  // to avoid leaking memory over a long multi-step session.
  const previews = useMemo(
    () => media.map((file) => URL.createObjectURL(file)),
    [media],
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleChange = (e) => {
    onAdd(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <div>
      <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 sm:w-auto">
        📁 Choose Files
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      <p className="mt-3 text-sm text-gray-500">
        Photos and videos are optional, but trips with at least a few photos get read a lot more.
      </p>

      {media.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((file, index) => (
            <div key={`${file.name}-${index}`} className="group relative overflow-hidden rounded-xl bg-gray-100">
              {file.type.startsWith("video") ? (
                <video src={previews[index]} className="h-28 w-full object-cover" muted />
              ) : (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="h-28 w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
              <p className="truncate bg-black/50 px-2 py-1 text-[11px] text-white">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MediaUploader;
