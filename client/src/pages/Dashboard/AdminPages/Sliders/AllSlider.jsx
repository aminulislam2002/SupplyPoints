import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import AddSlider from "./AddSlider";
import UpdateSlider from "./UpdateSlider";
import Loader from "../../../../components/Loader/Loader";

const AllSlider = () => {
  const [isAddNewSlider, setIsAddNewSlider] = useState(false);
  const [isUpdateSlider, setIsUpdateSlider] = useState(false);
  const [sliderId, setSliderId] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("slider_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allSliders = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["sliders"],
    queryFn: async () => {
      const res = await axiosPublic.get("/sliders");
      return res?.data && res.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  // Delete Slider
  const handleDeleteSlider = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this slider!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/sliders/${id}`);
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

  // Handle Add New Slider & Update Slider Modal
  const handleAddNewSliderModal = (status, id) => {
    if (status === "New") {
      setIsAddNewSlider(true);
    }

    if (status === "Update") {
      setSliderId(id);
      setIsUpdateSlider(true);
    }

    modal.showModal();
  };

  if (isPending && allSliders.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new slider CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">Sliders</h3>

          <button
            onClick={() => handleAddNewSliderModal("New")}
            className="btn btn-primary w-full sm:w-auto"
          >
            <FaPlus size={12} />
            <span className="text-base font-medium">Add New</span>
          </button>
        </div>
      </div>

      {/* All Sliders Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Image</th>
              <th>Link</th>
              <th>Added Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">Loading...</td>
              </tr>
            ) : allSliders?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">No sliders found.</td>
              </tr>
            ) : (
              allSliders?.map((slider, index) => (
                <tr
                  key={slider?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>
                  <td>
                    <div className="relative w-full h-full overflow-hidden">
                      <LazyLoadImage
                        src={import.meta.env.VITE_IMAGE_URL + slider?.image}
                        alt={`Slider ${index + 1}`}
                        effect="blur"
                        className="w-32 h-20 object-cover rounded-md"
                      />
                    </div>
                  </td>
                  <td>
                    {slider?.link ? (
                      <a
                        href={slider?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline max-w-xs truncate inline-block"
                      >
                        {slider?.link}
                      </a>
                    ) : (
                      <span className="text-primary-400">No link</span>
                    )}
                  </td>
                  <td>
                    {new Date(slider?.addedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="relative w-full h-full flex justify-center items-center gap-2.5">
                      <button
                        onClick={() =>
                          handleAddNewSliderModal("Update", slider?._id)
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit
                          className="text-blue-500"
                          size={18}
                        ></FaRegEdit>
                      </button>

                      <button
                        onClick={() => handleDeleteSlider(slider?._id)}
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

      {/* Add & Update Modal */}
      <dialog
        id="slider_add_update_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto p-4 sm:p-6">
          <button
            onClick={() => {
              modal.close();
              setIsAddNewSlider(false);
              setIsUpdateSlider(false);
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            <IoClose size={20} />
          </button>

          {isAddNewSlider && (
            <AddSlider
              refetch={refetch}
              setIsAddNewSlider={setIsAddNewSlider}
              modal={modal}
            />
          )}

          {isUpdateSlider && (
            <UpdateSlider
              refetch={refetch}
              setIsUpdateSlider={setIsUpdateSlider}
              sliderId={sliderId}
              modal={modal}
            />
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AllSlider;
