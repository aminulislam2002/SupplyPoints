const Input = ({
  label,
  type,
  placeholder,
  register,
  errors,
  name,
  defaultValue,
  value,
  min,
  max,
  required,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-base font-medium truncate">{label}</p>
      <input
        type={type ? type : "text"}
        placeholder={placeholder}
        {...register(name, { required: required, min: min, max: max })}
        defaultValue={defaultValue}
        value={value ? value : undefined}
        aria-invalid={errors[name] ? "true" : "false"}
        className="control w-full text-base text-nowrap truncate mt-1"
      />
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default Input;
