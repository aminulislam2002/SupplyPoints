import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Loader from "../../../../components/Loader/Loader";

const TodoList = () => {
  const axiosSecure = useAxiosSecure();

  const { isPending, data: todoList = [] } = useQuery({
    queryKey: ["seller-todo-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/seller-todo/my-tasks");
      return res?.data?.data || [];
    },
    staleTime: 10000,
    refetchInterval: 60000,
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">TODO List</h1>
            <p className="text-sm text-text-secondary mt-1">বাড়তি আয়ের জন্য</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex w-1/2 text-nowrap justify-center h-10 items-center px-4 rounded-md surface-muted text-sm font-medium">
              মোট কাজ: {todoList?.length || 0}
            </div>
            <Link
              to="/marketing"
              className="btn btn-primary inline-flex w-1/2 text-nowrap justify-center h-10 items-center gap-2 px-4 rounded-md text-white text-sm font-medium transition-colors duration-300"
            >
              মাইক্রো জব
            </Link>
          </div>
        </div>
      </div>

      {todoList?.length === 0 ? (
        <div className="card p-8 shadow-sm text-center">
          <p className="text-base text-text-secondary">
            আপনার সক্রিয় মার্কেটিং প্যাকগুলোর জন্য কোনো টাস্ক খুঁজে পাওয়া
            যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {todoList?.map((task) => (
            <div
              key={task?._id}
              className="card p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{task?.packName}</h3>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                  Reward: ৳{Number(task?.taskValue || 0).toFixed(2)}
                </span>
              </div>

              <div className="control border bg-section-bg/30 p-3">
                <p className="text-sm font-semibold text-primary-300 mb-1">
                  Instruction
                </p>
                <p className="text-sm text-text-primary leading-relaxed">
                  {task?.description}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={task?.taskUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 px-4 rounded-md bg-blue-700 hover:bg-blue-600 text-blue-50 text-sm font-medium transition-colors duration-300"
                >
                  <FaExternalLinkAlt size={12} />
                  Work Link
                </a>

                {task?.isCompletedToday ? (
                  <button
                    disabled
                    className="inline-flex h-10 items-center gap-2 px-4 rounded-md bg-gray-600 text-gray-300 text-sm font-medium cursor-not-allowed"
                    title="You already completed this task today"
                  >
                    <MdOutlineTaskAlt size={16} />
                    Completed Today
                  </button>
                ) : (
                  <Link
                    to={`/dashboard/seller/todo-submit/${task?._id}`}
                    className="btn btn-primary inline-flex h-10 items-center gap-2 px-4 rounded-md text-white text-sm font-medium transition-colors duration-300"
                  >
                    <MdOutlineTaskAlt size={16} />
                    Mark As Complete
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
