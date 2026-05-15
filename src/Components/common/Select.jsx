const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
}) => {
  return (
    <div>
      {/* LABEL */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-bodyText">
          {label}
        </label>
      )}

      {/* SELECT */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl bg-cardBg text-headingText border 
        ${
          error
            ? "border-red-500"
            : "border-borderMain"
        }
        focus:outline-none focus:ring-2 focus:ring-primaryFocus`}
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() +
              option.slice(1)}
          </option>
        ))}
      </select>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;