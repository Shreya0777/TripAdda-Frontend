const Input = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="label">{label}</label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full bg-black text-white border rounded-lg px-4 py-3 placeholder-gray-400 appearance-none ${
        error ? "border-red-500" : "border-gray-500"
      }`}
    />

    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
  </div>
);

export default Input;