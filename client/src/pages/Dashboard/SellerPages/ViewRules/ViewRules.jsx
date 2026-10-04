import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../hooks/useAxiosPublic/useAxiosPublic";
import Loader from "../../../../components/Loader/Loader";
import { MdRule } from "react-icons/md";

const ViewRules = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch all rules
  const { isPending, data: allRulesResponse = {} } = useQuery({
    queryKey: ["allRules"],
    queryFn: async () => {
      const res = await axiosPublic.get("/rules");
      return res.data;
    },
  });

  const { data: allRules = [] } = allRulesResponse;

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-primary-100 text-primary-700">
            <MdRule size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Seller Rules</h1>
            <p className="text-sm text-text-secondary mt-1">
              Follow these guidelines to keep your account compliant and secure
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <p className="text-sm text-text-secondary">
          Total Published Rules:{" "}
          <span className="font-semibold text-text-primary">
            {allRules?.length || 0}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        {allRules?.length === 0 ? (
          <div className="card p-12 text-center">
            <MdRule size={56} className="mx-auto text-primary-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No rules found</h3>
            <p className="text-sm text-text-secondary">
              There are currently no seller rules available.
            </p>
          </div>
        ) : (
          allRules.map((rule, index) => (
            <div
              key={rule?._id}
              className="card p-5 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="btn btn-primary w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base leading-7 whitespace-pre-wrap text-text-primary">
                    {rule?.rule}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewRules;
