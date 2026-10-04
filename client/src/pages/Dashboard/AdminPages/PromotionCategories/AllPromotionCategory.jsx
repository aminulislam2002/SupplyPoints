import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import AddPromotionCategory from "./AddPromotionCategory";
import UpdatePromotionCategory from "./UpdatePromotionCategory";

const AllPromotionCategory = () => {
  const [isAddNewCategory, setIsAddNewCategory] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("promotion_category_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allCategory = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["promotion-categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/promotion-categories");
      return res?.data?.data || [];
    },
    placeholderData: keepPreviousData,
  });

  const handleDeleteCategory = (id) => {
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
          const res = await axiosSecure.delete(`/promotion-categories/${id}`);
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

  const handleCategoryAddUpdateModal = (status, id) => {
    if (status === "New") {
      setIsAddNewCategory(true);
    }

    if (status === "Update") {
      setCategoryId(id);
      setIsUpdateCategory(true);
    }

    modal.showModal();
  };

  if (isPending && allCategory.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="page-title w-full text-lg">Promotion Categories</h3>

          <button
            onClick={() => handleCategoryAddUpdateModal("New")}
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
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="4">Loading...</td>
              </tr>
            ) : allCategory?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="4">No categories found.</td>
              </tr>
            ) : (
              allCategory?.map((category, index) => (
                <tr
                  key={category?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>
                  <td>
                    <img
                      src={import.meta.env.VITE_IMAGE_URL + category?.image}
                      alt={category?.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>

                  <td>
                    {category?.name} - ({category?.packCount || 0})
                  </td>

                  <td>
                    <div className="flex justify-center items-center gap-2.5">
                      <button
                        title="Update"
                        onClick={() =>
                          handleCategoryAddUpdateModal("Update", category?._id)
                        }
                        className="btn-icon h-9 w-9 rounded-full"
                      >
                        <FaRegEdit className="text-blue-500" size={18} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteCategory(category?._id)}
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

      <dialog id="promotion_category_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-xl overflow-y-auto p-4 sm:p-6">
          <div>
            {isUpdateCategory && (
              <UpdatePromotionCategory
                categoryId={categoryId}
                refetch={refetch}
                setIsUpdateCategory={setIsUpdateCategory}
                setCategoryId={setCategoryId}
                modal={modal}
              />
            )}

            {isAddNewCategory && (
              <AddPromotionCategory
                refetch={refetch}
                setIsAddNewCategory={setIsAddNewCategory}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllPromotionCategory;
