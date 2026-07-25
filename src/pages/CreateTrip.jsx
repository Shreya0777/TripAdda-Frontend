import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../api/axios";
import Input from "../Components/common/Input";
import Select from "../Components/common/Select";
import Textarea from "../Components/common/Textarea";
import StarRating from "../Components/common/StarRating";
import TagInput from "../Components/common/TagInput";
import StepProgress from "../Components/CreateTrip/StepProgress";
import MediaUploader from "../Components/CreateTrip/MediaUploader";
import Daylogjournal from "../Components/CreateTrip/DayLogJournal";
import BudgetSplit, { estimateCosts } from "../Components/CreateTrip/BudgetSplit";
import { useDraftAutosave } from "../hooks/useDraftAutosave";

const INITIAL_FORM = {
  title: "",
  description: "",

  city: "",
  state: "",
  country: "India",

  boardingPoint: "",

  duration: "",
  tripType: "",
  bestTimeToVisit: "",

  transportMode: "",
  transportName: "",
  transportRoute: "",
  transportDuration: "",
  transportFare: "",
  transportTips: [],

  totalBudget: "",
  costPerPerson: "",
  stayCost: "",
  foodCost: "",
  transportCost: "",
  sightseeingCost: "",
  otherCost: "", // FIX: existed in schema/backend but had no input before

  hotelName: "",
  stayLocation: "",
  pricePerNight: "",
  stayType: "",
  stayRating: "",
  stayReview: "",
  worthIt: true,

  mustTryFoods: [],
  cafes: [],
  budgetFoodOptions: [],

  itineraryType: "text",
  itineraryText: "",
  itineraryVideoUrl: "",

  travelerTips: [],

  overallRating: "",
  budgetRating: "",
  safetyRating: "",
  foodRating: "",
  stayRatingValue: "",
  transportRating: "",
  experienceRating: "", // FIX: existed in schema/backend but had no input before

  tags: [],
};

const STEPS = [
  { id: "basics", label: "Basics" },
  { id: "transport-budget", label: "Transport & Budget" },
  { id: "stay-food", label: "Stay & Food" },
  { id: "itinerary", label: "Itinerary & Experience" },
  { id: "ratings-tags", label: "Ratings & Tags" },
  { id: "media", label: "Media" },
  { id: "review", label: "Review" },
];

// FIX (cold-start friction): only the fields the backend actually
// requires block moving forward / publishing. Everything else is
// genuinely optional, so a first-time contributor can get through this
// in a couple of minutes rather than facing ~40 fields as equally
// mandatory.
function validateStep(stepIndex, form, dayLogEntries = []) {
  const errors = {};

  if (stepIndex === 0) {
    if (!form.title.trim()) errors.title = "Required";
    if (!form.city.trim()) errors.city = "Required";
    if (!form.boardingPoint.trim()) errors.boardingPoint = "Required";
    if (!form.duration) errors.duration = "Required";
  }

  if (stepIndex === 1) {
    if (!form.transportMode) errors.transportMode = "Required";
    if (!form.totalBudget) errors.totalBudget = "Required";
    if (!form.costPerPerson) errors.costPerPerson = "Required";
  }

  if (stepIndex === 3) {
    if (!form.description.trim()) errors.description = "Required";

    if (form.itineraryType === "text" && !form.itineraryText.trim()) {
      errors.itineraryText = "Required";
    }
    if (form.itineraryType === "photos") {
      const hasCompleteEntry = dayLogEntries.some((e) => e.caption.trim());
      if (!hasCompleteEntry) errors.dayLog = "Add at least one day with a caption";
    }
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
  const [dayLogEntries, setDayLogEntries] = useState([]); // #1/#4: photo-journal entries
  const [budgetMode, setBudgetMode] = useState("estimate"); // #2: estimate vs exact
  const [budgetPreset, setBudgetPreset] = useState("even");
  const [touchedRatings, setTouchedRatings] = useState(new Set()); // #3: which sub-ratings the user manually set
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const { restoredDraft, hasCheckedForDraft, saveDraft, clearDraft } = useDraftAutosave();

  // Offer to restore a draft once, right after mount.
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
                  // Captions/day numbers come back; the file itself never
                  // could be persisted, so it's simply absent (`file: null`)
                  // until the user re-attaches a photo for that entry.
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

  // Autosave text fields on every change. Media/photo files themselves
  // can't be persisted (browser limitation) — only lightweight metadata
  // is saved so the restore prompt is honest about what's recoverable.
  useEffect(() => {
    const mediaMeta = media.map((f) => ({ name: f.name, size: f.size }));
    const dayLogMeta = dayLogEntries.map((e) => ({ day: e.day, caption: e.caption, hadFile: !!e.file }));
    saveDraft(form, mediaMeta, dayLogMeta, budgetMode, budgetPreset);
  }, [form, media, dayLogEntries, budgetMode, budgetPreset, saveDraft]);


  const SUB_RATING_FIELDS = ["budgetRating", "safetyRating", "foodRating", "stayRatingValue", "transportRating", "experienceRating"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "overallRating") {
      // FIX (#3): most people have one overall gut feeling about a trip,
      // not seven independently-considered ratings. Setting the overall
      // rating defaults every sub-rating the user hasn't touched yet to
      // match it — they can still override any individual one afterward.
      setForm((prev) => {
        const next = { ...prev, overallRating: value };
        SUB_RATING_FIELDS.forEach((field) => {
          if (!touchedRatings.has(field)) next[field] = value;
        });
        return next;
      });
      setErrors((prev) => ({ ...prev, overallRating: undefined }));
      return;
    }

    if (SUB_RATING_FIELDS.includes(name)) {
      setTouchedRatings((prev) => new Set(prev).add(name));
    }

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

      // #2: if the user picked "estimate" mode, the sub-cost fields were
      // never filled in directly — compute them from the total budget +
      // chosen split right before sending, so the backend still just
      // sees plain numbers (no schema/route changes needed for this part).
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

      // #1/#4: send the day-log journal as captions/day-numbers (JSON)
      // plus the actual photo files, only for entries that have one —
      // `hasFile` tells the backend how to line the two arrays back up.
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
            Help travelers with real experiences, budget insights and hidden gems ✨
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
          {/* STEP 1 — BASICS */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary sm:text-xl">🧭 Basic Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Trip Title *" name="title" value={form.title} onChange={handleChange} error={errors.title} />
                <Input label="Boarding Point *" name="boardingPoint" value={form.boardingPoint} onChange={handleChange} error={errors.boardingPoint} />
                <Input label="City *" name="city" value={form.city} onChange={handleChange} error={errors.city} />
                <Input label="State" name="state" value={form.state} onChange={handleChange} />
                <Input label="Country" name="country" value={form.country} onChange={handleChange} />
                <Input label="Duration (days) *" name="duration" type="number" value={form.duration} onChange={handleChange} error={errors.duration} />
                <Select label="Trip Type" name="tripType" value={form.tripType} onChange={handleChange} options={["solo", "friends", "family", "couple"]} />
                <Input label="Best Time To Visit" name="bestTimeToVisit" value={form.bestTimeToVisit} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* STEP 2 — TRANSPORT & BUDGET */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🚗 Transport</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select label="Transport Mode *" name="transportMode" value={form.transportMode} onChange={handleChange} options={["train", "flight", "bus", "car", "bike", "other"]} error={errors.transportMode} />
                  <Input label="Transport Name" name="transportName" value={form.transportName} onChange={handleChange} />
                  <Input label="Route" name="transportRoute" value={form.transportRoute} onChange={handleChange} />
                  <Input label="Travel Duration (e.g. 6 hours)" name="transportDuration" value={form.transportDuration} onChange={handleChange} />
                  <Input label="Transport Fare" name="transportFare" type="number" value={form.transportFare} onChange={handleChange} />
                </div>
                <div className="mt-4">
                  <TagInput label="Transport Tips" name="transportTips" value={form.transportTips} onChange={handleChange} placeholder="Type a tip and press Enter" />
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">💰 Budget Details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
          )}

          {/* STEP 3 — STAY & FOOD */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🏨 Stay Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Hotel/Stay Name" name="hotelName" value={form.hotelName} onChange={handleChange} />
                  <Input label="Stay Location" name="stayLocation" value={form.stayLocation} onChange={handleChange} />
                  <Input label="Price Per Night" name="pricePerNight" type="number" value={form.pricePerNight} onChange={handleChange} />
                  <Select label="Stay Type" name="stayType" value={form.stayType} onChange={handleChange} options={["hotel", "hostel", "homestay", "resort", "airbnb"]} />
                  <StarRating label="Stay Rating" name="stayRating" value={form.stayRating} onChange={handleChange} />
                </div>
                <div className="mt-4">
                  <Textarea label="Stay Review" name="stayReview" value={form.stayReview} onChange={handleChange} />
                </div>
                {/* FIX: `worthIt` existed in the schema/backend but had no
                    input anywhere in the original form — same class of bug
                    as otherCost/experienceRating. */}
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Was the stay worth the money?</label>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, worthIt: !prev.worthIt }))}
                    className={`rounded-full px-4 py-1 text-sm font-medium transition ${
                      form.worthIt ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {form.worthIt ? "Yes 👍" : "No 👎"}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🍜 Food Recommendations</h2>
                <div className="space-y-4">
                  <TagInput label="Must Try Foods" name="mustTryFoods" value={form.mustTryFoods} onChange={handleChange} placeholder="Add a dish and press Enter" />
                  <TagInput label="Best Cafes" name="cafes" value={form.cafes} onChange={handleChange} placeholder="Add a cafe and press Enter" />
                  <TagInput label="Budget Food Options" name="budgetFoodOptions" value={form.budgetFoodOptions} onChange={handleChange} placeholder="Add an option and press Enter" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — ITINERARY & EXPERIENCE */}
          {currentStep === 3 && (
            <div className="space-y-6">
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
                      placeholder={`Day 1 - Arrival and local market\nDay 2 - Sightseeing\nDay 3 - Cafe hopping`}
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
                      value={form.itineraryVideoUrl || ""}
                      onChange={handleChange}
                      placeholder="Link to your trip video (YouTube, Drive, etc.)"
                    />
                  </div>
                )}
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">✨ Travel Experience</h2>
                <Textarea label="Description *" name="description" value={form.description} onChange={handleChange} error={errors.description} />
                <div className="mt-4">
                  <TagInput label="Traveler Tips" name="travelerTips" value={form.travelerTips} onChange={handleChange} placeholder="Add a tip and press Enter" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 — RATINGS & TAGS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">⭐ Ratings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <StarRating label="Overall Rating" name="overallRating" value={form.overallRating} onChange={handleChange} error={errors.overallRating} required />
                  <StarRating label="Budget Rating" name="budgetRating" value={form.budgetRating} onChange={handleChange} />
                  <StarRating label="Safety Rating" name="safetyRating" value={form.safetyRating} onChange={handleChange} />
                  <StarRating label="Food Rating" name="foodRating" value={form.foodRating} onChange={handleChange} />
                  <StarRating label="Stay Rating" name="stayRatingValue" value={form.stayRatingValue} onChange={handleChange} />
                  <StarRating label="Transport Rating" name="transportRating" value={form.transportRating} onChange={handleChange} />
                  <StarRating label="Experience Rating" name="experienceRating" value={form.experienceRating} onChange={handleChange} />
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🏷 Tags</h2>
                <TagInput label="Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="Add a tag and press Enter" />
              </div>
            </div>
          )}

          {/* STEP 6 — MEDIA */}
          {currentStep === 5 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-primary sm:text-xl">🖼 Upload Media</h2>
              <MediaUploader
                media={media}
                onAdd={(files) => setMedia((prev) => [...prev, ...files])}
                onRemove={(index) => setMedia((prev) => prev.filter((_, i) => i !== index))}
              />
            </div>
          )}

          {/* STEP 7 — REVIEW */}
          {currentStep === 6 && (
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
                <p><span className="text-gray-500">Destination:</span> {form.city || "—"}</p>
                <p><span className="text-gray-500">Duration:</span> {form.duration ? `${form.duration} days` : "—"}</p>
                <p><span className="text-gray-500">Total Budget:</span> {form.totalBudget || "—"}</p>
                <p><span className="text-gray-500">Overall Rating:</span> {form.overallRating ? `${form.overallRating}/5` : "—"}</p>
                <p><span className="text-gray-500">Media attached:</span> {media.length}</p>
                {form.itineraryType === "photos" && (
                  <p><span className="text-gray-500">Day-log entries:</span> {dayLogEntries.filter((e) => e.caption.trim()).length}</p>
                )}
              </div>

              {loading && (
                <div className="w-full rounded-full bg-gray-200">
                  <div
                    className="rounded-full bg-blue-600 py-1 text-center text-xs text-white transition-all"
                    style={{ width: `${Math.max(uploadPercent, 5)}%` }}
                  >
                    {uploadPercent}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION */}
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
              {loading ? `Publishing… ${uploadPercent}%` : "Publish Experience"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;