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
import UpdateSubCategory from "./UpdateSubCategory";
import AddSubCategory from "./AddSubCategory";

const AllSubCategory = () => {
  const [isAddNewCategory, setIsAddNewCategory] = useState(false);
  const [isUpdateCategory, setIsUpdateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const modal = document.getElementById("sub_category_add_update_modal");

  const {
    isPending,
    isFetching,
    data: allSubCategory = [],
    refetch,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/sub-categories");
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
          const res = await axiosSecure.delete(`/sub-categories/${id}`);
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

  if (isPending && allSubCategory.length === 0) {
    return <Loader></Loader>;
  }

  return (
    <div className="space-y-4 p-5 sm:p-6">
      {/* Add new category CTA */}
      <div className="flex w-full items-center justify-between rounded-lg border border-border-color bg-card-bg p-4">
        <div className="w-full flex justify-between items-center">
          <h3 className="w-full text-lg font-medium text-start">
            Sub-Categories
          </h3>

          <button
            onClick={() => handleCategoryAddUpdateModal("New")}
            className="btn primary-btn h-10 gap-1.5 text-nowrap"
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
              <th>Image</th>
              <th>Sub-Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && isPlaceholderData ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">Loading...</td>
              </tr>
            ) : allSubCategory?.length === 0 ? (
              <tr className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color">
                <td colSpan="5">No categories found.</td>
              </tr>
            ) : (
              allSubCategory?.map((category, index) => (
                <tr
                  key={category?._id}
                  className="h-10 text-base text-nowrap font-normal text-center border-b border-border-color"
                >
                  <th>{index + 1}</th>
                  <td>
                    <div className="relative w-full h-full overflow-hidden">
                      <LazyLoadImage
                        src={import.meta.env.VITE_IMAGE_URL + category?.image}
                        alt={category?.categoryId}
                        effect="blur"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  </td>
                  <td>
                    {category?.name} - ({category?.productCount})
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

                      {/* <button
                        title="Delete"
                        onClick={() => handleDeleteCategory(category?._id)}
                        className="btn-icon h-9 w-9 rounded-full border-danger/20 hover:bg-red-50"
                      >
                        <RiDeleteBin6Line
                          className="text-red-500"
                          size={18}
                        ></RiDeleteBin6Line>
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add & Update category Modal */}
      <dialog id="sub_category_add_update_modal" className="modal">
        <div className="modal-surface relative max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto p-4 lg:p-5">
          <div>
            {isUpdateCategory && (
              <UpdateSubCategory
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                setIsUpdateCategory={setIsUpdateCategory}
                refetch={refetch}
                modal={modal}
              />
            )}

            {isAddNewCategory && (
              <AddSubCategory
                setIsAddNewCategory={setIsAddNewCategory}
                refetch={refetch}
                modal={modal}
              />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AllSubCategory;
