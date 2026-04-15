import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Input from "../Components/common/Input";
import Select from "../Components/common/Select";
import Textarea from "../Components/common/Textarea";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    destination: "",
    duration: "",
    totalBudget: "",
    costPerPerson: "",
    transportation: "",
    localTravel: "",
    description: "",
    hotelName: "",
    hotelRating: "",
    stayCost: "",
    overallRating: "",
    pros: "",
    cons: "",
    tips: "",
    tripType: "",
    bestTimeToVisit: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 validation
  const validate = () => {
    let newErrors = {};

    if (!form.from) newErrors.from = "Required";
    if (!form.destination) newErrors.destination = "Required";
    if (!form.duration) newErrors.duration = "Required";
    if (!form.costPerPerson) newErrors.costPerPerson = "Required";
    if (!form.transportation) newErrors.transportation = "Required";
    if (!form.stayCost) newErrors.stayCost = "Required";

    if (!form.description) {
      newErrors.description = "Required";
    } else if (form.description.trim().split(/\s+/).length < 200) {
      newErrors.description = "Minimum 200 words required";
    }

    if (!form.overallRating) newErrors.overallRating = "Required";
    if (!image) newErrors.image = "Image required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 submit
  const handleSubmit = async () => {
    console.log("CLICKED");
    // if (!validate()) return;
    if (!validate()) {
  console.log("Validation Failed", errors);
  return;
}

    try {
      setLoading(true);

      const formData = new FormData();

      // append all except tags
      Object.keys(form).forEach((key) => {
        if (key !== "tags") {
          formData.append(key, form[key]);
        }
      });

      // numbers fix
      formData.set("duration", Number(form.duration));
      formData.set("totalBudget", Number(form.totalBudget));
      formData.set("costPerPerson", Number(form.costPerPerson));
      formData.set("hotelRating", Number(form.hotelRating));
      formData.set("stayCost", Number(form.stayCost));
      formData.set("overallRating", Number(form.overallRating));

      // tags fix
      formData.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      // image
      formData.append("image", image);

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
  <div className="bg-gray-100 min-h-screen py-10 px-4">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Curate Your Next Journey
        </h1>
        <p className="text-gray-500 mt-2">
          Capture your travel story and share your experience.
        </p>
      </div>

      {/* 🧭 ESSENTIALS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">🧭 The Essentials</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Starting From" name="from" value={form.from} onChange={handleChange} error={errors.from} />
          <Input label="Destination" name="destination" value={form.destination} onChange={handleChange} error={errors.destination} />
          <Input label="Duration (days)" name="duration" value={form.duration} onChange={handleChange} error={errors.duration} />
          <Input label="Overall Rating" name="overallRating" value={form.overallRating} onChange={handleChange} error={errors.overallRating} />

          <Select
            label="Trip Type"
            name="tripType"
            value={form.tripType}
            onChange={handleChange}
            options={["solo", "friends", "family", "couple"]}
          />

          <Input label="Best Time to Visit" name="bestTimeToVisit" value={form.bestTimeToVisit} onChange={handleChange} />

          <Input label="Cost Per Person" name="costPerPerson" value={form.costPerPerson} onChange={handleChange} error={errors.costPerPerson} />
        </div>
      </div>

      {/* 🚗 LOGISTICS */}
      <div className="bg-blue-50 p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">🚗 Logistics & Stay</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Transportation"
            name="transportation"
            value={form.transportation}
            onChange={handleChange}
            options={["train", "flight", "bus", "car", "other"]}
            error={errors.transportation}
          />

          <Input label="Hotel Name" name="hotelName" value={form.hotelName} onChange={handleChange} />

          <Input label="Hotel Rating" name="hotelRating" value={form.hotelRating} onChange={handleChange} />

          <Input label="Stay Cost" name="stayCost" value={form.stayCost} onChange={handleChange} error={errors.stayCost} />
        </div>
      </div>

      {/* ✨ EXPERIENCE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">✨ The Experience</h2>

        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Textarea label="Pros" name="pros" value={form.pros} onChange={handleChange} />
          <Textarea label="Cons" name="cons" value={form.cons} onChange={handleChange} />
        </div>

        <Textarea label="Tips" name="tips" value={form.tips} onChange={handleChange} />
      </div>

      {/* 🖼️ MEDIA */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">🖼️ Media Gallery</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-2 rounded-lg"
        />

        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image}</p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500"
        >
          Discard
        </button>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded-lg">
            Save Draft
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Publishing..." : "Publish Experience"}
          </button>
        </div>
      </div>

    </div>
  </div>
);
};

export default CreateTrip;