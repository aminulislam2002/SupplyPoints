import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Input from "../../../../components/FormFileds/Input";
import Textarea from "../../../../components/FormFileds/Textarea";
import Select from "../../../../components/FormFileds/Select";

const AddFaq = ({ refetch, setIsAddNewFaq, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Post Category
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.post("/faqs", data);
      const successMessage = res?.data?.message || "Success";
      refetch();
      reset();
      setIsAddNewFaq(false);
      modal.close();
      await Swal.fire({ title: successMessage, icon: "success" });
    } catch (error) {
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

  // Add Category Modal Close
  const handleCloseAddFaq = () => {
    setIsAddNewFaq(false);
    reset();
    modal.close();
  };

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Add New FAQ
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <Select
            label="Category"
            placeholder="Select Category"
            register={register}
            errors={errors}
            name="category"
            required={true}
            options={["Reselling", "Promotion", "Marketing"]}
          />
        </div>

        <div className="relative w-full h-full flex flex-col">
          <Input
            label="Question"
            type="text"
            placeholder="Example: What is your return policy?"
            register={register}
            errors={errors}
            name="question"
            required={true}
          />
        </div>

        <div className="relative w-full h-full flex flex-col">
          <Textarea
            label="Answer"
            placeholder="Example: You can return any item within 7 days of purchase."
            register={register}
            errors={errors}
            name="answer"
            required={true}
            rows={5}
          />
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseAddFaq}
            type="button"
            className="btn danger-btn h-10"
          >
            <MdClose size={18}></MdClose>
            Cancel
          </button>
          <button type="submit" className="btn primary-btn h-10">
            <BsDatabaseFillAdd size={18}></BsDatabaseFillAdd>
            <span>{isLoading ? "Processing..." : "Add New"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFaq;
