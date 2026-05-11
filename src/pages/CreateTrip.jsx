import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import Input from "../Components/common/Input";
import Select from "../Components/common/Select";
import Textarea from "../Components/common/Textarea";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // Basic
    title: "",
    description: "",

    // Destination
    city: "",
    state: "",
    country: "India",

    // Boarding
    boardingPoint: "",

    // Trip
    duration: "",
    tripType: "",
    bestTimeToVisit: "",

    // Transport
    transportMode: "",
    transportName: "",
    transportRoute: "",
    transportDuration: "",
    transportFare: "",
    transportTips: "",

    // Budget
    totalBudget: "",
    costPerPerson: "",
    stayCost: "",
    foodCost: "",
    transportCost: "",
    sightseeingCost: "",
    otherCost: "",

    // Stay
    hotelName: "",
    stayLocation: "",
    pricePerNight: "",
    stayType: "",
    stayRating: "",
    stayReview: "",
    worthIt: true,

    // Food
    mustTryFoods: "",
    cafes: "",
    budgetFoodOptions: "",

    // Itinerary
    itineraryType: "text",
    itineraryVideoUrl: "",

    // Tips
    travelerTips: "",

    // Ratings
    overallRating: "",
    budgetRating: "",
    safetyRating: "",
    foodRating: "",
    stayRatingValue: "",
    transportRating: "",
    experienceRating: "",

    // Tags
    tags: "",
  });

  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE MEDIA
  const handleMediaChange = (e) => {
    setMedia([...e.target.files]);
  };

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.title) newErrors.title = "Required";

    if (!form.city) newErrors.city = "Required";

    if (!form.boardingPoint)
      newErrors.boardingPoint = "Required";

    if (!form.duration)
      newErrors.duration = "Required";

    if (!form.totalBudget)
      newErrors.totalBudget = "Required";

    if (!form.costPerPerson)
      newErrors.costPerPerson = "Required";

    if (!form.transportMode)
      newErrors.transportMode = "Required";

    if (!form.description)
      newErrors.description = "Required";

    if (!form.overallRating)
      newErrors.overallRating = "Required";

    if (media.length === 0)
      newErrors.media = "At least one media required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      // Append normal fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // JSON stringify arrays
      formData.set(
        "transportTips",
        JSON.stringify(
          form.transportTips
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.set(
        "mustTryFoods",
        JSON.stringify(
          form.mustTryFoods
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.set(
        "cafes",
        JSON.stringify(
          form.cafes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.set(
        "budgetFoodOptions",
        JSON.stringify(
          form.budgetFoodOptions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.set(
        "travelerTips",
        JSON.stringify(
          form.travelerTips
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.set(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      // Upload media
      media.forEach((file) => {
        formData.append("media", file);
      });

      // API call
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

      alert(
        err.response?.data?.message ||
          "Error creating trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Share Your Travel Experience
          </h1>

          <p className="text-gray-500 mt-2">
            Help travelers with real experiences,
            budget insights and hidden gems ✨
          </p>
        </div>

        {/* BASIC */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            🧭 Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

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
              options={[
                "solo",
                "friends",
                "family",
                "couple",
              ]}
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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            🚗 Transport Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <Select
              label="Transport Mode"
              name="transportMode"
              value={form.transportMode}
              onChange={handleChange}
              options={[
                "train",
                "flight",
                "bus",
                "car",
                "bike",
                "other",
              ]}
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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            💰 Budget Details
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <Input
              label="Total Budget"
              name="totalBudget"
              value={form.totalBudget}
              onChange={handleChange}
            />

            <Input
              label="Cost Per Person"
              name="costPerPerson"
              value={form.costPerPerson}
              onChange={handleChange}
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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            🏨 Stay Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

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
              options={[
                "hotel",
                "hostel",
                "homestay",
                "resort",
                "airbnb",
              ]}
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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
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

        {/* EXPERIENCE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            ✨ Travel Experience
          </h2>

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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            ⭐ Ratings
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <Input
              label="Overall Rating"
              name="overallRating"
              value={form.overallRating}
              onChange={handleChange}
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
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            🏷 Tags
          </h2>

          <Textarea
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        {/* MEDIA */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            🖼 Upload Media
          </h2>

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="w-full border p-2 rounded-lg"
          />

          {errors.media && (
            <p className="text-red-500 text-sm mt-2">
              {errors.media}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            {loading
              ? "Publishing..."
              : "Publish Experience"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTrip;