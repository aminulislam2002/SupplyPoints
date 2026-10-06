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
  icon: Icon,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold tracking-wide text-text-secondary truncate">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-500"
            size={18}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            required,
            minLength,
            maxLength,
          })}
          className={`control w-full text-sm ${Icon ? "pl-10" : ""}`}
        />
      </div>

      {errors[name] && (
        <p className="text-xs text-danger font-medium mt-1">
          {errors[name].type === "required" && `${label} আবশ্যক।`}
        </p>
      )}
    </div>
  );
};

export default InputField;