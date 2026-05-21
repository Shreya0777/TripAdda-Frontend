const Textarea = ({ label, name, value, onChange, error, placeholder, rows = 4 }) => (
  <div className="w-full">
    {label && (
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}

    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500 sm:text-base ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />

    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Textarea;
