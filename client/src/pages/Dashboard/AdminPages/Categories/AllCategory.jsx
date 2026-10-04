import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";

const AllCategory = () => {
  const [isAddNewCategory, setIsAddNewCategory] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("category_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allCategory = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res?.data && res?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  // Delete Category
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
          const res = await axiosSecure.delete(`/categories/${id}`);
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

  // Handle Add New Category & Update Category Modal
  const handleCategoryAddUpdateModal = (status, url) => {
    if (status === "New") {
      setIsAddNewCategory(true);
    }

    if (status === "Update") {
      setCategoryId(url);
      setIsUpdateCategory(true);
    }

    modal.showModal();
  };

  if (isPending && allCategory.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new category CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="w-full text-lg font-medium text-start">Categories</h3>

          <button
            onClick={() => handleCategoryAddUpdateModal("New")}
            className="btn btn-primary h-10 gap-1.5 text-nowrap"
          >
            <FaPlus size={12}></FaPlus>
            <span className="text-base font-medium">Add New</span>
          </button>
        </div>
      </div>

      {/* All Categories Table */}
      <div className="table-shell">
        <table className="table">
          <thead className="bg-section-bg">
            <tr className="h-10 text-sm text-nowrap font-normal text-center">
              <th>#</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="3">Loading...</td>
              </tr>
            ) : allCategory?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="3">No categories found.</td>
              </tr>
            ) : (
              allCategory?.map((category, index) => (
                <tr
                  key={category?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>

                  <td>
                    {category?.name} - (
                    {category?.productCount.toLocaleString()})
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
                        <FaRegEdit
                          className="text-blue-500"
                          size={18}
                        ></FaRegEdit>
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDeleteCategory(category?._id)}
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

      {/* Add & Update category Modal */}
      <dialog id="category_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-xl overflow-y-auto p-4 sm:p-6">
          <div>
            {isUpdateCategory && (
              <UpdateCategory
                categoryId={categoryId}
                refetch={refetch}
                setIsUpdateCategory={setIsUpdateCategory}
                setCategoryId={setCategoryId}
                modal={modal}
              />
            )}

            {isAddNewCategory && (
              <AddCategory
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

export default AllCategory;
