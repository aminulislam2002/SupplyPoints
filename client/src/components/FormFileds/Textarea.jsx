const Textarea = ({
  label,
  placeholder,
  register,
  errors,
  name,
  defaultValue,
  required,
  rows,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-base font-medium truncate">{label}</p>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name, { required: required })}
        defaultValue={defaultValue}
        aria-invalid={errors[name] ? "true" : "false"}
        className="control w-full text-base mt-1"
      />

      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default Textarea;
