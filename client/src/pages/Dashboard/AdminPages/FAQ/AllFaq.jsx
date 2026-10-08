import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../../../components/Loader/Loader";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import AddFaq from "./AddFaq";
import UpdateFaq from "./UpdateFaq";
import { FaPlus, FaRegEdit } from "react-icons/fa";

const AllFaq = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isResetQueryLoading, setIsResetQueryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [category, setCategory] = useState("");
  const [limitPerPage, setLimitPerPage] = useState(5);
  const [isAddNewFaq, setIsAddNewFaq] = useState(false);
  const [isUpdateFaq, setIsUpdateFaq] = useState(false);
  const [faqId, setFaqId] = useState(null);

  const modal = document.getElementById("faq_add_update_modal");

  // Fetch all faqs
  const {
    isPending,
    isFetching,
    data: allFaqResponse = {}, // Default to an empty object
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["allFaq", currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get("/faqs", {
        params: { currentPage, limitPerPage, category },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    refetch();
  }, [refetch, limitPerPage, category]);

  // Destructure data and hasMore
  const { data: allFaq = [], totalFaqs, hasMore } = allFaqResponse;

  const handleResetAllQuery = () => {
    setIsResetQueryLoading(true); // Start the loading animation
    try {
      // Reset all states
      setCategory("");
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

  // Delete an faq
  const handleDeleteFaq = (id) => {
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
          const res = await axiosSecure.delete(`/faqs/${id}`);
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

  // Handle Add New FAQ & Update FAQ Modal
  const handleAddFaqAndUpdateFaqModal = (status, id) => {
    if (status === "New") {
      setIsAddNewFaq(true);
    }

    if (status === "Update") {
      setFaqId(id);
      setIsUpdateFaq(true);
    }

    modal.showModal();
  };

  if (isPending && allFaq.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new FAQ CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">FAQs - {totalFaqs}</h3>

          <button
            onClick={() => handleAddFaqAndUpdateFaqModal("New")}
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
          {/* Category Selected */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="control h-10"
            >
              <option value="">All Faqs</option>
              {["Reselling", "Promotion", "Marketing"]?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

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

      {/* Faq Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Category</th>
              <th>FAQ</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">Loading...</td>
              </tr>
            ) : allFaq?.length === 0 ? (
              <tr className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">No faqs found.</td>
              </tr>
            ) : (
              allFaq?.map((faq, index) => (
                <tr
                  key={faq._id}
                  className="h-10 text-sm text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{currentPage * limitPerPage + index + 1}</th>
                  <td>{faq.category}</td>
                  <td>
                    {faq.question}
                    {faq.answer && (
                      <p className="text-sm font-normal text-primary-600 mt-1">
                        {faq.answer.length > 50
                          ? faq.answer.substring(0, 50) + "..."
                          : faq.answer}
                      </p>
                    )}
                  </td>
                  <td>
                    <div className="h-full flex justify-center items-center gap-2">
                      <button
                        title="Update"
                        onClick={() =>
                          handleAddFaqAndUpdateFaqModal("Update", faq._id)
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
                        onClick={() => handleDeleteFaq(faq._id)}
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

      {/* Add & Update category Modal */}
      <dialog id="faq_add_update_modal" className="modal">
        <div className="modal-surface relative w-11/12 max-w-2xl">
          <div>
            {isUpdateFaq && (
              <UpdateFaq
                faqId={faqId}
                refetch={refetch}
                setIsUpdateFaq={setIsUpdateFaq}
                setFaqId={setFaqId}
                modal={modal}
              />
            )}

            {isAddNewFaq && (
              <AddFaq
                refetch={refetch}
                setIsAddNewFaq={setIsAddNewFaq}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllFaq;
