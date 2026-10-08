import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { IoImageOutline } from "react-icons/io5";
import { MdClose, MdDeleteForever } from "react-icons/md";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useCategories from "../../../../hooks/useCategories/useCategories";
import useVariants from "../../../../hooks/useVariants/useVariants";
import Loader from "../../../../components/Loader/Loader";
import ProductInput from "../../../../components/ProductInput/ProductInput";
import ProductTextarea from "../../../../components/ProductTextarea/ProductTextarea";
import ProductCheckbox from "../../../../components/ProductCheckbox/ProductCheckbox";
import useSubCategories from "../../../../hooks/useSubCategories/useSubCategories";

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();
  const [isActiveTab, setIsActiveTab] = useState("Descriptions");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    colors,
    clothSizes,
    shoesSizes,
    babySizes,
    volumeSizes,
    weightSizes,
  } = useVariants();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    watch,
  } = useForm({
    defaultValues: {
      isVerified: false,
    },
  });

  const category = watch("category");

  const { isCategoriesLoading, isCategoriesFetching, categories } =
    useCategories();
  const { isSubCategoriesFetching, subCategories } = useSubCategories({
    categoryId: category,
  });

  // preview the selected image
  const thumbnailImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedThumbnail(e.target.files[0]);
      trigger("thumbnail");
    }
  };

  // Clear the preview / selected image
  const removeSelectedThumbnail = () => {
    setSelectedThumbnail(null);
  };

  // Preview the selected photos
  const photosImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPhotos((prevPhotos) => [
        ...prevPhotos,
        ...Array.from(e.target.files),
      ]);
      trigger("photos");
    }
  };

  // Clear a single photo
  const removeSelectedPhoto = (index) => {
    setSelectedPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  // Add Product
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    // Append the thumbnail (single file)
    formData.append("thumbnail", selectedThumbnail);

    // Append each file in `photos` (multiple files)
    selectedPhotos.forEach((file) => {
      formData.append("photos", file);
    });

    // Append other form fields
    for (const key in data) {
      if (key === "colors" || key === "sizes") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await axiosSecure.post("/products/add-product", formData);
      const successMessage = res?.data?.message || "Success";
      reset();
      navigate("/dashboard/admin/products");
      setSelectedThumbnail(null);
      setSelectedPhotos([]);
      Swal.fire({
        title: successMessage,
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      Swal.fire({
        title: errorMessage,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCategoriesLoading && (!categories || categories.length === 0)) {
    return <Loader></Loader>;
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <h3 className="text-lg font-medium ">Add New Product</h3>

        <div>
          <Link
            to="/dashboard/admin/products"
            className="btn outline-btn relative h-10 w-auto gap-1.5 px-2.5 text-nowrap"
          >
            <span className="text-base font-medium">View All</span>
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-5"
      >
        {/* Title */}
        <div className="relative w-full h-full col-span-12">
          <ProductInput
            register={register}
            errors={errors}
            name="title"
            label="Product Title"
            type="text"
            required={true}
            placeholder="EKSA E900 Pro Black-Red Wired Over-Ear Gaming Headphone"
          ></ProductInput>
        </div>

        {/* Product Category */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <p className="text-sm font-medium truncate">Product Category</p>
          <select
            {...register("category", { required: true })}
            aria-invalid={errors.category ? "true" : "false"}
            className="control mt-1 h-10 w-full truncate text-sm text-nowrap"
          >
            {isCategoriesFetching ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Category</option>
                {categories?.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.category?.type === "required" && (
            <p
              role="alert"
              className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              This Field is Required
            </p>
          )}
        </div>

        {/* Sub Category */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <p className="text-sm font-medium truncate">Product Sub-Category</p>
          <select
            {...register("subCategory", { required: true })}
            aria-invalid={errors.subCategory ? "true" : "false"}
            className="control mt-1 h-10 w-full truncate text-sm text-nowrap disabled:opacity-50"
            disabled={!category || isSubCategoriesFetching}
          >
            {isSubCategoriesFetching ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Sub-Category</option>
                {subCategories?.map((subCategory) => (
                  <option key={subCategory?._id} value={subCategory?._id}>
                    {subCategory?.name}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.subCategory?.type === "required" && (
            <p
              role="alert"
              className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              This Field is Required
            </p>
          )}
        </div>

        {/* Availability */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <p className="text-sm font-medium truncate">Availability</p>
          <select
            {...register("availability", { required: false })}
            aria-invalid={errors.availability ? "true" : "false"}
            className="control mt-1 w-full text-sm"
          >
            <option value="">Select Availability</option>
            {["In Stock", "Out of Stock", "Limited Stock"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.availability?.type === "required" && (
            <p
              role="alert"
              className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
            >
              This Field is Required
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="quantity"
            label="Available Quantity (pcs)"
            type="number"
            min={1}
            required={true}
            placeholder={100}
          ></ProductInput>
        </div>

        {/* Price */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="price"
            label="Price (৳)"
            type="number"
            min={1}
            required={true}
            placeholder="2500"
          ></ProductInput>
        </div>

        {/* Suggested Price */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="suggestedPrice"
            label="Suggested Price (৳)"
            type="number"
            min={1}
            required={true}
            placeholder="3000"
          ></ProductInput>
        </div>

        {/* Selling Price */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="sellingPrice"
            label="Selling Price (৳)"
            type="number"
            min={0}
            required={false}
            placeholder="2800"
          ></ProductInput>
        </div>

        {/* Profit */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="profit"
            label="Profit (৳)"
            type="number"
            min={0}
            required={true}
            placeholder="100"
          ></ProductInput>
        </div>

        {/* Product Code */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <ProductInput
            register={register}
            errors={errors}
            name="productCode"
            label="Product Code"
            type="text"
            required={true}
            placeholder="DS0001"
          ></ProductInput>
        </div>

        {/* Verified */}
        <div className="relative w-full h-full space-y-2 col-span-12 md:col-span-4 lg:col-span-3 2xl:col-span-2">
          <p className="text-sm font-medium truncate">Verified Product</p>
          <div className="relative flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isVerified")}
              className=" border border-border-color rounded focus:outline-none focus:border-primary-500  focus:transition-colors focus:duration-300 w-8 h-8 hover:cursor-pointer"
            />
            <label className="text-base font-medium text-primary-800 ">
              Verified
            </label>
          </div>
        </div>

        {/* Media / Product Images */}
        <div className="relative w-full h-full col-span-12">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-primary-700 text-primary-50 mb-2.5">
            Product Images
          </div>

          <div className="flex flex-col lg:flex-row justify-between items- gap-5">
            {/* Thumbnail input field */}
            <div className="w-full lg:w-1/2">
              <h3 className="text-base font-medium  pb-2.5 border-b border-border-color mb-5">
                Product Thumbnail
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                <div className="w-full aspect-square border border-dashed border-border-color rounded-md">
                  <label
                    htmlFor="thumbnail"
                    className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-section-bg"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IoImageOutline size={32} />
                      <p className="text-center text-xs font-normal">
                        Size <br />
                        (1024px × 1024px)
                      </p>
                    </div>
                    <input
                      {...register("thumbnail", { required: true })}
                      id="thumbnail"
                      type="file"
                      onChange={thumbnailImageChange}
                      accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                      className="hidden"
                    />
                  </label>

                  {errors.thumbnail?.type === "required" && (
                    <p
                      role="alert"
                      className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
                    >
                      This Field is Required
                    </p>
                  )}
                </div>

                <div className="w-full aspect-square flex justify-center items-center relative">
                  {selectedThumbnail && (
                    <div className="w-full aspect-square relative">
                      <img
                        src={URL.createObjectURL(selectedThumbnail)}
                        alt="Selected"
                        className="w-full aspect-square object-cover rounded"
                      />

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={removeSelectedThumbnail}
                        className="text-red-500 text-sm absolute top-1 right-1 cursor-pointer bg-primary-50 rounded-full p-1 hover:bg-primary-100 transition-colors duration-300"
                      >
                        <MdDeleteForever size={20}></MdDeleteForever>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photos input field */}
            <div className="w-full lg:w-1/2">
              <h3 className="text-base font-medium  pb-2.5 border-b border-border-color mb-5">
                Product Photos
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                <div className="w-full aspect-square border border-dashed border-border-color rounded-md">
                  <label
                    htmlFor="photos"
                    className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-section-bg"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IoImageOutline size={32} />
                      <p className="text-center text-xs font-normal">
                        Size <br /> (1024px × 1024px)
                      </p>
                    </div>
                    <input
                      {...register("photos", { required: false })}
                      id="photos"
                      type="file"
                      multiple
                      onChange={photosImageChange}
                      accept="image/jpg, image/jpeg, image/png, image/webp, image/gif"
                      className="hidden"
                    />
                  </label>

                  {errors.photos?.type === "required" && (
                    <p
                      role="alert"
                      className="text-base font-medium text-red-500 mt-1 lg:mt-1.5"
                    >
                      This Field is Required
                    </p>
                  )}
                </div>

                {selectedPhotos?.map((photo, index) => (
                  <div key={index} className="relative w-full aspect-square">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected"
                      className="w-full aspect-square object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelectedPhoto(index)}
                      className="text-red-500 text-sm absolute top-1 right-1 cursor-pointer bg-primary-50 rounded-full p-1 hover:bg-primary-100 transition-colors duration-300"
                    >
                      <MdDeleteForever size={20}></MdDeleteForever>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative w-full h-full col-span-12">
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border-color bg-section-bg p-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-3 xl:grid-cols-5">
            {[
              "Descriptions",
              "Colors",
              "Clothing Sizes",
              "Number Sizes",
              "Baby Sizes",
              "Liter Units",
              "KG Units",
            ].map((tab, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setIsActiveTab(tab)}
                className={
                  isActiveTab === tab
                    ? "btn primary-btn h-10 w-full border border-primary-600 px-2 text-xs sm:text-sm"
                    : "btn outline-btn h-10 w-full border-border-color px-2 text-xs sm:text-sm"
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="relative w-full h-full col-span-12">
          {isActiveTab === "Descriptions" && (
            <div className="space-y-5">
              {/* Descriptions */}
              <div className="relative w-full h-full col-span-12">
                <ProductTextarea
                  register={register}
                  errors={errors}
                  name="descriptions"
                  label="Descriptions"
                  required={false}
                  placeholder="Write a Descriptions about this product..."
                  rows={5}
                ></ProductTextarea>
              </div>

              {/* Notes */}
              <div className="relative w-full h-full col-span-12">
                <ProductTextarea
                  register={register}
                  errors={errors}
                  name="notes"
                  label="Notes"
                  required={false}
                  placeholder="Write a Notes about this product..."
                  rows={2}
                ></ProductTextarea>
              </div>
            </div>
          )}

          {isActiveTab === "Colors" && (
            <div className="space-y-5">
              {/* Colors */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="Color"
                  name="colors"
                  options={colors}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}

          {isActiveTab === "Clothing Sizes" && (
            <div className="space-y-5">
              {/* Clothing Sizes */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="Clothing Size"
                  name="sizes"
                  options={clothSizes}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}

          {isActiveTab === "Number Sizes" && (
            <div className="space-y-5">
              {/* Number Sizes */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="Shoes Size"
                  name="sizes"
                  options={shoesSizes}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}

          {isActiveTab === "Baby Sizes" && (
            <div className="space-y-5">
              {/* Baby Sizes */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="Baby Sizes"
                  name="sizes"
                  options={babySizes}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}

          {isActiveTab === "Liter Units" && (
            <div className="space-y-5">
              {/* Volume Sizes */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="Liter Unit"
                  name="sizes"
                  options={volumeSizes}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}

          {isActiveTab === "KG Units" && (
            <div className="space-y-5">
              {/* Weight Sizes */}
              <div className="relative w-full h-full col-span-12">
                <ProductCheckbox
                  label="KG Unit"
                  name="sizes"
                  options={weightSizes}
                  register={register}
                ></ProductCheckbox>
              </div>
            </div>
          )}
        </div>

        <div className="relative w-full h-full col-span-12 flex justify-end gap-2.5 mb-5">
          <Link
            to="/dashboard/admin/products"
            className="btn secondary-btn w-full sm:w-auto"
          >
            <MdClose size={18}></MdClose>
            Cancel
          </Link>
          <button type="submit" className="btn primary-btn w-full sm:w-auto">
            <BsDatabaseFillAdd size={18}></BsDatabaseFillAdd>
            <span>{isLoading ? "Processing..." : "Add New"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
