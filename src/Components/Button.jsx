const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "px-5 py-3 rounded-xl font-medium transition duration-200";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800",

    outline:
      "border border-gray-300 hover:bg-gray-100 text-gray-700",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;