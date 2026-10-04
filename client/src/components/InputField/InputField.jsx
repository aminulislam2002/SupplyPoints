const InputField = ({
  label,
  type,
  placeholder,
  register,
  name,
  required,
  minLength,
  maxLength,
  errors,
}) => {
  return (
    <div className="mb-4 space-y-1">
      <label className="text-sm font-medium truncate">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required,
          minLength,
          maxLength,
        })}
        className="control mt-1 w-full text-sm text-nowrap truncate"
      />

      {errors[name] && (
        <p className="text-sm text-red-600 mt-1">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default InputField;
