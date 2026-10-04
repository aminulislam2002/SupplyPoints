const ProductTextarea = ({
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
    <div className="space-y-2.5">
      <label className="block text-sm font-semibold text-text-primary">{label}</label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name, { required: required })}
        defaultValue={defaultValue}
        aria-invalid={errors[name] ? "true" : "false"}
        className="textarea min-h-32 w-full text-sm leading-6 sm:text-base"
      />

      {errors[name] && (
        <p className="text-sm text-danger">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default ProductTextarea;
