import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import AddRule from "./AddRule";
import UpdateRule from "./UpdateRule";
import { FaPlus, FaRegEdit } from "react-icons/fa";

const AllRule = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [isAddNewRule, setIsAddNewRule] = useState(false);
  const [isUpdateRule, setIsUpdateRule] = useState(false);
  const [ruleId, setRuleId] = useState(null);

  const modal = document.getElementById("rule_add_update_modal");

  // Fetch all rules
  const {
    isPending,
    isFetching,
    data: allRuleResponse = {}, // Default to an empty object
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["allRule", currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("/rules", {
        params: { currentPage, limitPerPage },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [refetch, limitPerPage]);

  // Destructure data and hasMore
  const { data: allRule = [], totalRules, hasMore } = allRuleResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setLimitPerPage(5);
      setCurrentPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      // Delay stopping the animation slightly
      setTimeout(() => {
        setIsResetQueryLoading(false); // Stop the loading animation
      }, 500);
    }
  };

  // Delete a rule
  const handleDeleteRule = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/rules/${id}`);
          const successMessage = res?.data?.message || "Success";
          Swal.fire({
            title: "Deleted!",
            text: successMessage,
            icon: "success",
          });
          refetch();
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  // Handle Add New Rule & Update Rule Modal
  const handleAddRuleAndUpdateRuleModal = (status, id) => {
    if (status === "New") {
      setIsAddNewRule(true);
    }

    if (status === "Update") {
      setRuleId(id);
      setIsUpdateRule(true);
    }

    modal.showModal();
  };

  if (isPending && allRule.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new Rule CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">Rules - {totalRules}</h3>

          <button
            onClick={() => handleAddRuleAndUpdateRuleModal("New")}
            className="btn primary-btn w-full sm:w-auto"
          >
            <FaPlus size={12}></FaPlus>
            <span className="text-base font-medium">Add New</span>
          </button>
        </div>
      </div>

      {/* Filter, sort and pagination query */}
      <div className="py-2.5">
        <div className="flex flex-wrap justify-start items-center gap-2.5">
          {/* Page Limit selected */}
          <div className="relative flex items-center gap-2.5">
            <label htmlFor="limitPerPage" className="text-base font-medium ">
              Show
            </label>
            <select
              id="limitPerPage"
              value={limitPerPage}
              onChange={(e) => setLimitPerPage(e.target.value)}
              className="control h-10"
            >
              {["5", "10", "20", "50", "100"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleResetAllQuery} className="btn-icon h-10 w-10">
            <TfiReload
              size={15}
              className={isResetQueryLoading ? "animate-spin" : ""}
            ></TfiReload>
          </button>
        </div>
      </div>

      {/* Rule Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Rule</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="3">Loading...</td>
              </tr>
            ) : allRule?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="3">No rules found.</td>
              </tr>
            ) : (
              allRule?.map((rule, index) => (
                <tr
                  key={rule._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td className="text-left">
                    {rule.rule && (
                      <p className="text-sm font-normal">
                        {rule.rule.length > 100
                          ? rule.rule.substring(0, 100) + "..."
                          : rule.rule}
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="h-full flex justify-center items-center gap-2">
                      <button
                        title="Update"
                        onClick={() =>
                          handleAddRuleAndUpdateRuleModal("Update", rule._id)
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit
                          className="text-blue-500"
                          size={18}
                        ></FaRegEdit>
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteRule(rule._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line
                          className="text-red-500"
                          size={18}
                        ></RiDeleteBin6Line>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Button */}
      <div className="px-2.5 py-1.5 lg:px-5 lg:py-2.5 flex justify-center lg:justify-end items-center gap-2.5">
        <button
          className={
            currentPage === 0
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "btn-icon h-9 w-9 rounded-full"
          }
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <IoIosArrowBack size={20}></IoIosArrowBack>
        </button>

        <span className="text-base font-medium ">{currentPage + 1}</span>

        <button
          className={
            isPlaceholderData || !hasMore
              ? "bg-primary-200  text-primary-600 cursor-not-allowed rounded-md p-1.5"
              : "btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
          }
          onClick={() => {
            if (!isPlaceholderData && hasMore) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={isPlaceholderData || !hasMore}
        >
          <IoIosArrowForward size={20}></IoIosArrowForward>
        </button>
      </div>

      {/* Add & Update Rule Modal */}
      <dialog id="rule_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto p-4 lg:p-5">
          <div>
            {isUpdateRule && (
              <UpdateRule
                ruleId={ruleId}
                refetch={refetch}
                setIsUpdateRule={setIsUpdateRule}
                setRuleId={setRuleId}
                modal={modal}
              />
            )}

            {isAddNewRule && (
              <AddRule
                refetch={refetch}
                setIsAddNewRule={setIsAddNewRule}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllRule;
