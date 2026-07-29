import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../api/axios";
import Input from "../Components/common/Input";
import Select from "../Components/common/Select";
import Textarea from "../Components/common/Textarea";
import StarRating from "../Components/common/StarRating";
import TagInput from "../Components/common/TagInput";
import LocationAutocomplete from "../Components/common/LocationAutocomplete";
import StepProgress from "../Components/CreateTrip/StepProgress";
import MediaUploader from "../Components/CreateTrip/MediaUploader";
import DayLogJournal from "../Components/CreateTrip/Daylogjournal";
import BudgetSplit, { estimateCosts } from "../Components/CreateTrip/BudgetSplit";
import { useDraftAutosave } from "../hooks/useDraftAutosave";

// FIX: cut down significantly based on feedback from real people who
// tried the earlier, longer version — dropped Transport Details, Stay
// Details, Food Recommendations, and per-category sub-ratings entirely.
// Kept only what people actually said they wanted: title/destination,
// description, itinerary, cost breakdown, media, and a suggestions/tip
// field. `boardingPoint` and `overallRating` are still collected because
// the backend requires them, but folded into compact steps rather than
// given their own dedicated sections.
//
// FIX 2: removed `city` / `state` as standalone fields (redundant with
// boardingPoint for most users and rarely filled in accurately), and
// merged the Description and Itinerary steps into a single "Story &
// Itinerary" step since they're really the same narrative in people's
// heads.
const INITIAL_FORM = {
  title: "",
  description: "",

  country: "India",
  boardingPoint: "",
  duration: "",

  tripType: "friends",
  bestTimeToVisit: "",

  transportMode: "",
  transportFare: "",

  totalBudget: "",
  costPerPerson: "",
  stayCost: "",
  foodCost: "",
  transportCost: "",
  sightseeingCost: "",
  otherCost: "",

  itineraryType: "text",
  itineraryText: "",
  itineraryVideoUrl: "",

  travelerTips: [],
  overallRating: "",
};

const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "story", label: "Story & Itinerary" },
  { id: "cost", label: "Cost Breakdown" },
  { id: "media", label: "Media" },
  { id: "suggestions", label: "Suggestions & Rating" },
  { id: "review", label: "Review" },
];

function validateStep(stepIndex, form, dayLogEntries = []) {
  const errors = {};

  if (stepIndex === 0) {
    if (!form.title.trim()) errors.title = "Required";
    if (!form.boardingPoint.trim()) errors.boardingPoint = "Required";
    if (!form.duration) errors.duration = "Required";
  }

  if (stepIndex === 1) {
    if (!form.description.trim()) errors.description = "Required";
    else if (form.description.trim().length < 50)
      errors.description = "Description must be at least 50 characters";

    if (form.itineraryType === "text" && !form.itineraryText.trim()) {
      errors.itineraryText = "Required";
    }
    if (form.itineraryType === "photos") {
      const hasCompleteEntry = dayLogEntries.some((e) => e.caption.trim());
      if (!hasCompleteEntry) errors.dayLog = "Add at least one day with a caption";
    }
  }

  if (stepIndex === 2) {
    if (!form.totalBudget) errors.totalBudget = "Required";
    if (!form.costPerPerson) errors.costPerPerson = "Required";
  }

  if (stepIndex === 4) {
    if (!form.overallRating) errors.overallRating = "Required";
  }

  return errors;
}

function validateAllSteps(form, dayLogEntries) {
  const invalidSteps = [];
  for (let i = 0; i < STEPS.length; i++) {
    if (Object.keys(validateStep(i, form, dayLogEntries)).length > 0) invalidSteps.push(i);
  }
  return invalidSteps;
}

const CreateTrip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [media, setMedia] = useState([]);
  const [dayLogEntries, setDayLogEntries] = useState([]);
  const [budgetMode, setBudgetMode] = useState("estimate");
  const [budgetPreset, setBudgetPreset] = useState("even");
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const { restoredDraft, hasCheckedForDraft, saveDraft, clearDraft } = useDraftAutosave();

  useEffect(() => {
    if (!hasCheckedForDraft || !restoredDraft) return;

    const fileCount = restoredDraft.mediaMeta?.length || 0;
    const dayLogFileCount = (restoredDraft.dayLogEntries || []).filter((e) => e.hadFile).length;
    const totalFiles = fileCount + dayLogFileCount;

    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-medium">Resume your unfinished trip?</p>
          <p className="text-sm text-gray-500">
            We saved your progress{totalFiles > 0 ? ` (you'll need to re-attach ${totalFiles} file${totalFiles > 1 ? "s" : ""})` : ""}.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
              onClick={() => {
                setForm({ ...INITIAL_FORM, ...restoredDraft.form });
                if (restoredDraft.dayLogEntries) {
                  setDayLogEntries(
                    restoredDraft.dayLogEntries.map((e) => ({ day: e.day, caption: e.caption, file: null })),
                  );
                }
                if (restoredDraft.budgetMode) setBudgetMode(restoredDraft.budgetMode);
                if (restoredDraft.budgetPreset) setBudgetPreset(restoredDraft.budgetPreset);
                closeToast();
              }}
            >
              Restore
            </button>
            <button
              className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-700"
              onClick={() => {
                clearDraft();
                closeToast();
              }}
            >
              Start fresh
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeButton: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedForDraft, restoredDraft]);

  useEffect(() => {
    const mediaMeta = media.map((f) => ({ name: f.name, size: f.size }));
    const dayLogMeta = dayLogEntries.map((e) => ({ day: e.day, caption: e.caption, hadFile: !!e.file }));
    saveDraft(form, mediaMeta, dayLogMeta, budgetMode, budgetPreset);
  }, [form, media, dayLogEntries, budgetMode, budgetPreset, saveDraft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const invalidSteps = useMemo(() => validateAllSteps(form, dayLogEntries), [form, dayLogEntries]);

  const goToStep = (index) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form, dayLogEntries);
    setErrors((prev) => ({ ...prev, ...stepErrors }));

    if (Object.keys(stepErrors).length > 0) {
      toast.error("Please fill the required fields before continuing");
      return;
    }

    const next = Math.min(currentStep + 1, STEPS.length - 1);
    setFurthestStep((prev) => Math.max(prev, next));
    goToStep(next);
  };

  const handleBack = () => {
    goToStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async () => {
    const stillInvalid = validateAllSteps(form, dayLogEntries);
    if (stillInvalid.length > 0) {
      toast.error("Some required fields are missing — check the highlighted steps");
      goToStep(stillInvalid[0]);
      return;
    }

    try {
      setLoading(true);
      setUploadPercent(0);

      const formData = new FormData();

      const budgetOverrides =
        budgetMode === "estimate" ? estimateCosts(form.totalBudget, budgetPreset) : {};

      const submissionForm = { ...form, ...budgetOverrides };

      Object.entries(submissionForm).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      media.forEach((file) => formData.append("media", file));

      if (form.itineraryType === "photos") {
        const entriesMeta = dayLogEntries.map((entry) => ({
          day: entry.day,
          caption: entry.caption,
          hasFile: !!entry.file,
        }));
        formData.append("dayLogEntries", JSON.stringify(entriesMeta));
        dayLogEntries.forEach((entry) => {
          if (entry.file) formData.append("dayLogMedia", entry.file);
        });
      }

      await axios.post("/trips", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          setUploadPercent(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });

      clearDraft();
      toast.success("Trip shared successfully 🚀");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sectionBg px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-headingText sm:text-3xl">
            Share Your Travel Experience
          </h1>
          <p className="mt-2 text-sm text-mutedText sm:text-base">
            Real trips, real budgets, real tips — the short version ✨
          </p>
        </div>

        <StepProgress
          steps={STEPS}
          currentStep={currentStep}
          furthestStep={furthestStep}
          invalidSteps={invalidSteps}
          onStepClick={goToStep}
        />

        <div className="rounded-2xl bg-cardBg p-4 shadow sm:p-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary sm:text-xl">🧭 Basics</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Trip Title *" name="title" value={form.title} onChange={handleChange} error={errors.title} />
                <LocationAutocomplete
                  label="Boarding Point *"
                  name="boardingPoint"
                  value={form.boardingPoint}
                  onChange={handleChange}
                  error={errors.boardingPoint}
                  placeholder="e.g. Akshardham"
                  required
                />
                <Input label="Duration (days) *" name="duration" type="number" value={form.duration} onChange={handleChange} error={errors.duration} />
                <Select
                  label="Trip Type"
                  name="tripType"
                  value={form.tripType}
                  onChange={handleChange}
                  options={["solo", "friends", "family", "couple"]}
                />
                <Input
                  label="Best Time to Visit"
                  name="bestTimeToVisit"
                  value={form.bestTimeToVisit}
                  onChange={handleChange}
                  placeholder="e.g. October to March"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">✨ Tell the story</h2>
                <Textarea
                  label="Description *"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder="What was this trip like? What should someone know before planning the same one?"
                />
                <p
                  className={`mt-1 text-xs ${
                    form.description.trim().length < 50 ? "text-mutedText" : "text-green-600"
                  }`}
                >
                  {form.description.trim().length}/50 characters minimum
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🗓 Itinerary</h2>
                <Select label="Itinerary Type" name="itineraryType" value={form.itineraryType} onChange={handleChange} options={["text", "photos", "video"]} />
                {form.itineraryType === "text" && (
                  <div className="mt-4">
                    <Textarea
                      label="Day Wise Itinerary *"
                      name="itineraryText"
                      value={form.itineraryText}
                      onChange={handleChange}
                      error={errors.itineraryText}
                      placeholder={"Day 1 - Arrival and local market\nDay 2 - Sightseeing\nDay 3 - Cafe hopping"}
                    />
                  </div>
                )}
                {form.itineraryType === "photos" && (
                  <div className="mt-4">
                    <DayLogJournal entries={dayLogEntries} onChange={setDayLogEntries} />
                    {errors.dayLog && <p className="mt-2 text-sm text-red-500">{errors.dayLog}</p>}
                  </div>
                )}
                {form.itineraryType === "video" && (
                  <div className="mt-4">
                    <Input
                      label="Itinerary Video URL"
                      name="itineraryVideoUrl"
                      value={form.itineraryVideoUrl}
                      onChange={handleChange}
                      placeholder="Link to your trip video (YouTube, Drive, etc.)"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">💰 Cost Breakdown</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Transport Mode"
                  name="transportMode"
                  value={form.transportMode}
                  onChange={handleChange}
                  options={["train", "flight", "bus", "car", "bike", "other"]}
                />
                <Input
                  label="Transport Fare"
                  name="transportFare"
                  type="number"
                  value={form.transportFare}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                />
                <Input label="Total Budget *" name="totalBudget" type="number" value={form.totalBudget} onChange={handleChange} error={errors.totalBudget} />
                <Input label="Cost Per Person *" name="costPerPerson" type="number" value={form.costPerPerson} onChange={handleChange} error={errors.costPerPerson} />
              </div>
              <div className="mt-4">
                <BudgetSplit
                  form={form}
                  budgetMode={budgetMode}
                  setBudgetMode={setBudgetMode}
                  budgetPreset={budgetPreset}
                  setBudgetPreset={setBudgetPreset}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🖼 Upload Media</h2>
              <MediaUploader
                media={media}
                onAdd={(files) => setMedia((prev) => [...prev, ...files])}
                onRemove={(index) => setMedia((prev) => prev.filter((_, i) => i !== index))}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">💡 Suggestions for other travelers</h2>
                <TagInput label="Tips" name="travelerTips" value={form.travelerTips} onChange={handleChange} placeholder="Add a tip and press Enter" />
              </div>
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">⭐ Overall Rating</h2>
                <StarRating label="How was the trip overall?" name="overallRating" value={form.overallRating} onChange={handleChange} error={errors.overallRating} required />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary sm:text-xl">✅ Review & Publish</h2>

              {invalidSteps.length > 0 ? (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-medium">A few required fields still need attention:</p>
                  <ul className="mt-2 list-disc pl-5">
                    {invalidSteps.map((i) => (
                      <li key={i}>
                        <button className="underline" onClick={() => goToStep(i)}>
                          {STEPS[i].label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                  Everything required is filled in — ready to publish.
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <p><span className="text-gray-500">Title:</span> {form.title || "—"}</p>
                <p><span className="text-gray-500">Boarding Point:</span> {form.boardingPoint || "—"}</p>
                <p><span className="text-gray-500">Duration:</span> {form.duration ? form.duration + " days" : "—"}</p>
                <p><span className="text-gray-500">Total Budget:</span> {form.totalBudget || "—"}</p>
                <p><span className="text-gray-500">Overall Rating:</span> {form.overallRating ? form.overallRating + "/5" : "—"}</p>
                <p><span className="text-gray-500">Media attached:</span> {media.length}</p>
              </div>

              {loading && (
                <div className="w-full rounded-full bg-gray-200">
                  <div
                    className="rounded-full bg-blue-600 py-1 text-center text-xs text-white transition-all"
                    style={{ width: Math.max(uploadPercent, 5) + "%" }}
                  >
                    {uploadPercent}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-xl border border-borderMain px-5 py-3 disabled:opacity-40"
          >
            Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-buttonPrimaryBg px-6 py-3 text-inverseText hover:bg-buttonPrimaryHoverBg"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-buttonPrimaryBg px-6 py-3 text-inverseText hover:bg-buttonPrimaryHoverBg disabled:opacity-60"
            >
              {loading ? "Publishing… " + uploadPercent + "%" : "Publish Experience"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;