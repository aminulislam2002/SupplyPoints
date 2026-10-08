import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Input from "../../../../components/FormFileds/Input";
import Textarea from "../../../../components/FormFileds/Textarea";

const AddMilestone = ({ refetch, setIsAddNewMilestone, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Post Milestone
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.post("/milestones", data);
      const successMessage = res?.data?.message || "Success";
      refetch();
      reset();
      setIsAddNewMilestone(false);
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

  // Add Milestone Modal Close
  const handleCloseAddMilestone = () => {
    setIsAddNewMilestone(false);
    reset();
    modal.close();
  };

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Add New Milestone
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <Input
            label="Year"
            type="text"
            placeholder="Example: 2020"
            register={register}
            errors={errors}
            name="year"
            required={true}
          />
        </div>

        <div className="relative w-full h-full flex flex-col">
          <Input
            label="Title"
            type="text"
            placeholder="Example: Our First Store Opened"
            register={register}
            errors={errors}
            name="title"
            required={true}
          />
        </div>

        <div className="relative w-full h-full flex flex-col">
          <Textarea
            label="Description"
            placeholder="Example: We opened our first physical store in Dhaka, marking a significant milestone in our milestone."
            register={register}
            errors={errors}
            name="descriptions"
            required={true}
            rows={5}
          />
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseAddMilestone}
            type="button"
            className="btn danger-btn h-10"
          >
            <MdClose size={18}></MdClose>
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="btn primary-btn h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BsDatabaseFillAdd size={18}></BsDatabaseFillAdd>
            <span>{isLoading ? "Processing..." : "Add New"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMilestone;
