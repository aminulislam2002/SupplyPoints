const ProductCheckbox = ({
  label,
  name,
  register,
  defaultCheckedValues,
  options,
}) => {
  return (
    <div className="space-y-2">
      <p className="card-title truncate">{label}</p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10">
        {options?.map((option, index) => (
          <div
            key={index}
            className="flex min-h-9 w-full items-center gap-2 rounded-lg border border-border-color px-2"
          >
            <input
              type="checkbox"
              value={option}
              defaultChecked={defaultCheckedValues?.includes(option)}
              {...register(name, { required: false })}
              className="h-4 w-4 cursor-pointer accent-primary-600"
            />

            <p className="text-base font-normal">{option}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCheckbox;
