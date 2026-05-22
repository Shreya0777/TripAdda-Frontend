import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import Input from "../Components/common/Input";
import Select from "../Components/common/Select";
import Textarea from "../Components/common/Textarea";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
    transportTips: "",

    totalBudget: "",
    costPerPerson: "",
    stayCost: "",
    foodCost: "",
    transportCost: "",
    sightseeingCost: "",
    otherCost: "",

    hotelName: "",
    stayLocation: "",
    pricePerNight: "",
    stayType: "",
    stayRating: "",
    stayReview: "",
    worthIt: true,

    mustTryFoods: "",
    cafes: "",
    budgetFoodOptions: "",

    itineraryType: "text",
    itineraryText: "",

    travelerTips: "",

    overallRating: "",
    budgetRating: "",
    safetyRating: "",
    foodRating: "",
    stayRatingValue: "",
    transportRating: "",
    experienceRating: "",

    tags: "",
  });

  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleMediaChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setMedia((prevFiles) => [...prevFiles, ...selectedFiles]);

    e.target.value = "";
  };

  const validate = () => {
    let newErrors = {};

    if (!form.title) newErrors.title = "Required";
    if (!form.city) newErrors.city = "Required";
    if (!form.boardingPoint) newErrors.boardingPoint = "Required";
    if (!form.duration) newErrors.duration = "Required";
    if (!form.totalBudget) newErrors.totalBudget = "Required";
    if (!form.costPerPerson) newErrors.costPerPerson = "Required";
    if (!form.transportMode) newErrors.transportMode = "Required";
    if (!form.description) newErrors.description = "Required";
    if (!form.overallRating) newErrors.overallRating = "Required";

    if (form.itineraryType === "text" && !form.itineraryText) {
      newErrors.itineraryText = "Required";
    }

    if (media.length === 0) {
      newErrors.media = "At least one media required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.set(
        "transportTips",
        JSON.stringify(convertToArray(form.transportTips)),
      );
      formData.set(
        "mustTryFoods",
        JSON.stringify(convertToArray(form.mustTryFoods)),
      );
      formData.set("cafes", JSON.stringify(convertToArray(form.cafes)));
      formData.set(
        "budgetFoodOptions",
        JSON.stringify(convertToArray(form.budgetFoodOptions)),
      );
      formData.set(
        "travelerTips",
        JSON.stringify(convertToArray(form.travelerTips)),
      );
      formData.set("tags", JSON.stringify(convertToArray(form.tags)));

      media.forEach((file) => {
        formData.append("media", file);
      });

      await axios.post("/trips", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Trip Shared Successfully 🚀");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Share Your Travel Experience
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Help travelers with real experiences, budget insights and hidden
            gems ✨
          </p>
        </div>

        {/* BASIC */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
         <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">🧭 Basic Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Trip Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
            />
            <Input
              label="Boarding Point"
              name="boardingPoint"
              value={form.boardingPoint}
              onChange={handleChange}
              error={errors.boardingPoint}
            />
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
            <Input
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
            <Input
              label="Duration (days)"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              error={errors.duration}
            />

            <Select
              label="Trip Type"
              name="tripType"
              value={form.tripType}
              onChange={handleChange}
              options={["solo", "friends", "family", "couple"]}
            />

            <Input
              label="Best Time To Visit"
              name="bestTimeToVisit"
              value={form.bestTimeToVisit}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TRANSPORT */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
         <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">
            🚗 Transport Information
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Transport Mode"
              name="transportMode"
              value={form.transportMode}
              onChange={handleChange}
              options={["train", "flight", "bus", "car", "bike", "other"]}
              error={errors.transportMode}
            />

            <Input
              label="Transport Name"
              name="transportName"
              value={form.transportName}
              onChange={handleChange}
            />
            <Input
              label="Route"
              name="transportRoute"
              value={form.transportRoute}
              onChange={handleChange}
            />
            <Input
              label="Travel Duration"
              name="transportDuration"
              value={form.transportDuration}
              onChange={handleChange}
            />
            <Input
              label="Transport Fare"
              name="transportFare"
              value={form.transportFare}
              onChange={handleChange}
            />
            <Textarea
              label="Transport Tips (comma separated)"
              name="transportTips"
              value={form.transportTips}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BUDGET */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
         <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">💰 Budget Details</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Input
              label="Total Budget"
              name="totalBudget"
              value={form.totalBudget}
              onChange={handleChange}
              error={errors.totalBudget}
            />
            <Input
              label="Cost Per Person"
              name="costPerPerson"
              value={form.costPerPerson}
              onChange={handleChange}
              error={errors.costPerPerson}
            />
            <Input
              label="Stay Cost"
              name="stayCost"
              value={form.stayCost}
              onChange={handleChange}
            />
            <Input
              label="Food Cost"
              name="foodCost"
              value={form.foodCost}
              onChange={handleChange}
            />
            <Input
              label="Transport Cost"
              name="transportCost"
              value={form.transportCost}
              onChange={handleChange}
            />
            <Input
              label="Sightseeing Cost"
              name="sightseeingCost"
              value={form.sightseeingCost}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* STAY */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
       <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">🏨 Stay Details</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Hotel Name"
              name="hotelName"
              value={form.hotelName}
              onChange={handleChange}
            />
            <Input
              label="Stay Location"
              name="stayLocation"
              value={form.stayLocation}
              onChange={handleChange}
            />
            <Input
              label="Price Per Night"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={handleChange}
            />

            <Select
              label="Stay Type"
              name="stayType"
              value={form.stayType}
              onChange={handleChange}
              options={["hotel", "hostel", "homestay", "resort", "airbnb"]}
            />

            <Input
              label="Stay Rating"
              name="stayRating"
              value={form.stayRating}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Stay Review"
              name="stayReview"
              value={form.stayReview}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FOOD */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">
            🍜 Food Recommendations
          </h2>

          <div className="space-y-4">
            <Textarea
              label="Must Try Foods"
              name="mustTryFoods"
              value={form.mustTryFoods}
              onChange={handleChange}
            />
            <Textarea
              label="Best Cafes"
              name="cafes"
              value={form.cafes}
              onChange={handleChange}
            />
            <Textarea
              label="Budget Food Options"
              name="budgetFoodOptions"
              value={form.budgetFoodOptions}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ITINERARY */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">🗓 Itinerary</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Itinerary Type"
              name="itineraryType"
              value={form.itineraryType}
              onChange={handleChange}
              options={["text", "video"]}
            />
          </div>

          {form.itineraryType === "text" && (
            <div className="mt-4">
              <Textarea
                label="Day Wise Itinerary"
                name="itineraryText"
                value={form.itineraryText}
                onChange={handleChange}
                error={errors.itineraryText}
                placeholder={`Day 1 - Arrival and local market
Day 2 - Sightseeing
Day 3 - Cafe hopping`}
              />
            </div>
          )}

          {form.itineraryType === "video" && (
            <p className="text-sm text-gray-500 mt-4">
              Upload your itinerary video from the media section below 🎥
            </p>
          )}
        </div>

        {/* EXPERIENCE */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">✨ Travel Experience</h2>

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />

          <div className="mt-4">
            <Textarea
              label="Traveler Tips"
              name="travelerTips"
              value={form.travelerTips}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* RATINGS */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
         <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">⭐ Ratings</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Input
              label="Overall Rating"
              name="overallRating"
              value={form.overallRating}
              onChange={handleChange}
              error={errors.overallRating}
            />
            <Input
              label="Budget Rating"
              name="budgetRating"
              value={form.budgetRating}
              onChange={handleChange}
            />
            <Input
              label="Safety Rating"
              name="safetyRating"
              value={form.safetyRating}
              onChange={handleChange}
            />
            <Input
              label="Food Rating"
              name="foodRating"
              value={form.foodRating}
              onChange={handleChange}
            />
            <Input
              label="Stay Rating"
              name="stayRatingValue"
              value={form.stayRatingValue}
              onChange={handleChange}
            />
            <Input
              label="Transport Rating"
              name="transportRating"
              value={form.transportRating}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TAGS */}
        <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
         <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">🏷 Tags</h2>

          <Textarea
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        {/* MEDIA */}
<div className="rounded-2xl bg-white p-4 shadow sm:p-6">
 <h2 className="mb-4 text-lg font-bold text-black sm:mb-5 sm:text-xl">
    🖼 Upload Media
  </h2>

  {/* CUSTOM FILE INPUT */}
  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 sm:w-auto">
    📁 Choose Files

    <input
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={handleMediaChange}
      className="hidden"
    />
  </label>

  <p className="text-sm text-gray-500 mt-3">
    Upload images and videos for your trip
  </p>

  {/* SELECTED FILES */}
  {media.length > 0 && (
    <div className="mt-5">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        Selected files: {media.length}
      </p>

      <div className="space-y-3">
        {media.map((file, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl bg-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
              <span className="text-xl">
                {file.type.startsWith("video")
                  ? "🎥"
                  : "🖼"}
              </span>

              <p className="text-sm text-gray-700 truncate">
                {file.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMedia((prev) =>
                  prev.filter((_, i) => i !== index)
                )
              }
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {errors.media && (
    <p className="text-red-500 text-sm mt-3">
      {errors.media}
    </p>
  )}
</div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Publishing..." : "Publish Experience"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
