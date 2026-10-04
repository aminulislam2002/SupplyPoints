import { useEffect } from "react";

const ProductInput = ({
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
  useEffect(() => {
    const handleWheel = () => {
      const active = document.activeElement;
      if (active.type === "number" && active.classList.contains("noscroll")) {
        active.blur(); // Remove focus to prevent number scrolling
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

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
        className="control mt-1 w-full text-base text-nowrap truncate"
      />
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1">
          {errors[name].type === "required" && `${label} is required.`}
        </p>
      )}
    </div>
  );
};

export default ProductInput;
