import { useEffect, useRef, useState } from "react";

const DRAFT_KEY = "tripadda:create-trip-draft";
const SAVE_DELAY_MS = 600;

// FIX (the #1 issue from the review): the old form had no draft
// persistence at all. Closing the tab, a session timeout, or an
// accidental back-navigation lost everything the user had typed —
// for a ~40-field form, that's the single biggest reason someone would
// give up and never come back. This debounce-saves form text fields to
// localStorage as the user types, and restores them on mount.
//
// NOTE: File objects (photos/videos) cannot be persisted to
// localStorage — only their name/size are saved, purely so the restore
// prompt can honestly tell the user "you had 3 files selected, please
// re-attach them" instead of silently pretending nothing was lost.
export function useDraftAutosave() {
  const [restoredDraft, setRestoredDraft] = useState(null);
  const [hasCheckedForDraft, setHasCheckedForDraft] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setRestoredDraft(parsed);
      }
    } catch {
      // Corrupted draft — ignore rather than crash the page.
    } finally {
      setHasCheckedForDraft(true);
    }
  }, []);

  const saveDraft = (formState, mediaMetaState, dayLogEntriesState, budgetMode, budgetPreset) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            form: formState,
            mediaMeta: mediaMetaState,
            dayLogEntries: dayLogEntriesState,
            budgetMode,
            budgetPreset,
            savedAt: Date.now(),
          }),
        );
      } catch {
        // Storage full or unavailable — autosave is a convenience,
        // not a requirement, so fail silently rather than interrupt typing.
      }
    }, SAVE_DELAY_MS);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  return { restoredDraft, hasCheckedForDraft, saveDraft, clearDraft };
}