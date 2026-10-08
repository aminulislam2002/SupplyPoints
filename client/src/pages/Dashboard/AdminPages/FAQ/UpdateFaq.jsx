import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import Select from "../../../../components/FormFileds/Select";
import Textarea from "../../../../components/FormFileds/Textarea";
import Input from "../../../../components/FormFileds/Input";

const UpdateFaq = ({ faqId, setFaqId, setIsUpdateFaq, refetch, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  // Get a specific faq by id
  const { isPending: isFaqLoading, data: faq = {} } = useQuery({
    queryKey: ["faqId", faqId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/faqs/${faqId}`);
      return res?.data && res?.data?.data;
    },
    refetchOnWindowFocus: true,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (faq) {
      reset({
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq, reset]);

  // Post Faq
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.put(`/faqs/${faqId}`, data);
      const successMessage = res?.data?.message || "Success";
      refetch();
      reset();
      setIsUpdateFaq(false);
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
    setFaqId(null);
    setIsUpdateFaq(false);
    reset();
    modal.close();
  };

  if (isFaqLoading) {
    return <Loader></Loader>;
  }

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
            <span>{isLoading ? "Processing..." : "Update"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFaq;
