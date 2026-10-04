const Select = ({
  label,
  placeholder,
  register,
  options,
  errors,
  name,
  defaultValue,
  required,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-base font-medium truncate">{label}</p>
      <select
        placeholder={placeholder}
        {...register(name, { required: required })}
        defaultValue={defaultValue}
        aria-invalid={errors[name] ? "true" : "false"}
        className="control w-full text-base mt-1"
      >
        <option value="">Select {name}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default Select;
