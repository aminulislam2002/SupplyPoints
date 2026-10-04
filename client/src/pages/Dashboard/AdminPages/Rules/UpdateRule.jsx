import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BsDatabaseFillAdd } from "react-icons/bs";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../../components/Loader/Loader";
import Textarea from "../../../../components/FormFileds/Textarea";

const UpdateRule = ({ ruleId, setRuleId, setIsUpdateRule, refetch, modal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  // Get a specific rule by id
  const { isPending: isRuleLoading, data: rule = {} } = useQuery({
    queryKey: ["ruleId", ruleId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/rules/${ruleId}`);
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
    if (rule) {
      reset({
        rule: rule.rule,
      });
    }
  }, [rule, reset]);

  // Post Rule
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await axiosSecure.put(`/rules/${ruleId}`, data);
      const successMessage = res?.data?.message || "Success";
      refetch();
      reset();
      setIsUpdateRule(false);
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

  // Update Rule Modal Close
  const handleCloseUpdateRule = () => {
    setRuleId(null);
    setIsUpdateRule(false);
    reset();
    modal.close();
  };

  if (isRuleLoading) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <h3 className="section-title w-full border-b border-dashed border-border-color pb-2.5 text-center text-primary-600">
        Update Rule
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2.5">
        <div className="relative w-full h-full flex flex-col">
          <Textarea
            label="Rule"
            placeholder="Enter rule description..."
            register={register}
            errors={errors}
            name="rule"
            required={true}
            rows={5}
          />
        </div>

        <div className="relative w-full h-full flex justify-end gap-2.5">
          <button
            onClick={handleCloseUpdateRule}
            type="button"
            className="btn btn-danger h-10"
          >
            <MdClose size={18}></MdClose>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary h-10"
          >
            <BsDatabaseFillAdd size={18}></BsDatabaseFillAdd>
            <span>{isLoading ? "Processing..." : "Update"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRule;
