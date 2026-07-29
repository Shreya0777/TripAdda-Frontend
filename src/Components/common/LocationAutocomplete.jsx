import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "../../utils/loadGoogleMapsScript";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const LocationAutocomplete = ({ label, name, value, onChange, error, placeholder, required }) => {
  const [query, setQuery] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);
  const containerRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  // A session token groups a search-and-select into one billed session
  // instead of billing every keystroke separately — Google's recommended
  // way to keep Autocomplete costs down.
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Load the Google Maps script once, then create the AutocompleteService
  // this component needs.
  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript()
      .then((google) => {
        if (cancelled) return;
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        setReady(true);
      })
      .catch((err) => {
        console.error("Google Maps failed to load:", err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!ready || trimmed.length < 3 || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: trimmed,
        sessionToken: sessionTokenRef.current,
      },
      (results, status) => {
        setLoading(false);
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
          setPredictions([]);
          return;
        }
        setPredictions(results);
      },
    );
  }, [debouncedQuery, ready]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (prediction) => {
    // description is Google's full human-readable address string —
    // e.g. "Akshardham Bus Station, Delhi, India" — exactly what goes
    // into the field.
    setQuery(prediction.description);
    onChange({ target: { name, value: prediction.description } });
    setShowDropdown(false);
    setPredictions([]);

    // Start a fresh session token for the next search-and-select cycle.
    if (window.google) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange({ target: { name, value: e.target.value } });
    setShowDropdown(true);
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
        placeholder={placeholder || "Start typing a place..."}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {showDropdown && (loading || predictions.length > 0) && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {loading && <div className="px-3 py-2 text-sm text-gray-400">Searching…</div>}
          {!loading &&
            predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handleSelect(prediction)}
                className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-blue-50"
                title={prediction.description}
              >
                {prediction.description}
              </button>
            ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LocationAutocomplete;