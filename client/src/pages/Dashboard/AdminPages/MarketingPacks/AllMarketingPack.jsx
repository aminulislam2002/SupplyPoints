import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import AddMarketingPack from "./AddMarketingPack";
import UpdateMarketingPack from "./UpdateMarketingPack";

const AllMarketingPack = () => {
  const [isAddNewPack, setIsAddNewPack] = useState(false);
  const [isUpdatePack, setIsUpdatePack] = useState(false);
  const [packId, setPackId] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("marketing_pack_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allPacks = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["marketing-packs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/marketing-packs");
      return res?.data?.data || [];
    },
    placeholderData: keepPreviousData,
  });

  const handleDeletePack = (id) => {
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
          const res = await axiosSecure.delete(`/marketing-packs/${id}`);
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

  const handlePackAddUpdateModal = (status, id) => {
    if (status === "New") {
      setIsAddNewPack(true);
    }

    if (status === "Update") {
      setPackId(id);
      setIsUpdatePack(true);
    }

    modal.showModal();
  };

  if (isPending && allPacks.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">Marketing Packs</h3>

          <button
            onClick={() => handlePackAddUpdateModal("New")}
            className="btn btn-primary w-full sm:w-auto"
          >
            <FaPlus size={12} />
            <span className="text-base font-medium">Add New</span>
          </button>
        </div>
      </div>

      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Work Value</th>
              <th>Work Quantity</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="8">Loading...</td>
              </tr>
            ) : allPacks?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="8">No marketing packs found.</td>
              </tr>
            ) : (
              allPacks?.map((pack, index) => (
                <tr
                  key={pack?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>
                  <td>
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + pack?.image}
                      alt={pack?.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td>{pack?.name}</td>
                  <td>{pack?.category || "N/A"}</td>
                  <td>BDT {pack?.price}</td>
                  <td>BDT {pack?.taskValue}</td>
                  <td>{pack?.taskQty}</td>
                  <td>{pack?.durationDays} days</td>
                  <td>
                    <div className="flex justify-center items-center gap-2.5">
                      <button
                        title="Update"
                        onClick={() =>
                          handlePackAddUpdateModal("Update", pack?._id)
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit className="text-blue-500" size={18} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeletePack(pack?._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line className="text-red-500" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dialog id="marketing_pack_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-3xl overflow-y-auto p-4 sm:p-6">
          <div>
            {isUpdatePack && (
              <UpdateMarketingPack
                packId={packId}
                refetch={refetch}
                setIsUpdatePack={setIsUpdatePack}
                setPackId={setPackId}
                modal={modal}
              />
            )}

            {isAddNewPack && (
              <AddMarketingPack
                refetch={refetch}
                setIsAddNewPack={setIsAddNewPack}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllMarketingPack;
