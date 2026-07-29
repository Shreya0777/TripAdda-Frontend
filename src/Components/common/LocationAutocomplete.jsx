import { useEffect, useRef, useState } from "react";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const LocationAutocomplete = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
}) => {
  const [query, setQuery] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 3) {
      setPredictions([]);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            trimmed
          )}&addressdetails=1&limit=5`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await response.json();
        setPredictions(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setPredictions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange({
      target: {
        name,
        value: e.target.value,
      },
    });
    setShowDropdown(true);
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);

    onChange({
      target: {
        name,
        value: place.display_name,
      },
    });

    setPredictions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder || "Search location"}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {showDropdown && (loading || predictions.length > 0) && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {!loading &&
            predictions.map((place) => (
              <button
                key={place.place_id}
                type="button"
                onClick={() => handleSelect(place)}
                className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-blue-50"
                title={place.display_name}
              >
                {place.display_name}
              </button>
            ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default LocationAutocomplete;