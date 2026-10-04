import { useMemo, useState } from "react";
import axios from "axios";
import {
  RiAlertLine,
  RiBarChart2Line,
  RiLoader4Line,
  RiSearch2Line,
  RiShieldCheckLine,
  RiTimeLine,
} from "react-icons/ri";

const phonePattern = /^01[3-9]\d{8}$/;

const CourierFraudCheck = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const apiKey = import.meta.env.VITE_BD_COURIER_API_KEY;

  const courierEntries = useMemo(() => {
    const data = result?.data || {};

    return Object.entries(data).filter(([key]) => key !== "summary");
  }, [result]);

  const summary = result?.data?.summary;
  const reports = result?.reports || [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedPhone = phone.trim();

    if (!phonePattern.test(trimmedPhone)) {
      setError("সঠিক 11 ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন");
      setResult(null);
      return;
    }

    if (!apiKey) {
      setError("Courier API key missing.");
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api.bdcourier.com/courier-check",
        { phone: trimmedPhone },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      setResult(response.data);
    } catch (requestError) {
      const apiMessage = requestError?.response?.data?.message;

      setError(
        apiMessage ||
          requestError?.message ||
          "Fraud check failed. Please try again later.",
      );
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`relative w-full h-auto overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm`}
    >
      <div className="p-2.5 lg:p-5 space-y-5">
        <h1 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          <RiShieldCheckLine />
          Courier Fraud Check
        </h1>

        <p className="text-sm text-yellow-700 text-center">
          অর্ডার করার আগে অবশ্যই কাস্টমার চেকার দিয়ে যাচাই করতে হবে এবং অর্ডার
          কম্পিলিট রেট ৮০% এর উপরে থাকতে হবে। নির্ধারিত শর্ত অনুযায়ী অর্ডার
          প্লেস করতে হবে, অন্যথায় অর্ডার বাতিল করা হবে।
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1 space-y-1.5">
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition-colors focus-within:border-slate-900">
                <span className="flex h-full items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                  +88
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={11}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/\D/g, ""));
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="017xxxxxxxx"
                  className="h-full w-full border-0 bg-transparent px-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-36"
            >
              {isLoading ? (
                <RiLoader4Line className="animate-spin text-lg" />
              ) : (
                <RiSearch2Line className="text-lg" />
              )}
              {isLoading ? "Checking..." : "Check"}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <RiAlertLine className="mt-0.5 shrink-0 text-base" />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="space-y-2.5 lg:space-y-5 rounded-2xl border border-slate-200 bg-slate-50">
          {summary && (
            <div className="p-2.5 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center">
                Live Summary
              </p>
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                <MetricCard label="Total Parcel" value={summary.total_parcel} />
                <MetricCard
                  label="Success Ratio"
                  value={`${summary.success_ratio}%`}
                  accent="text-emerald-600"
                />
                <MetricCard label="Success" value={summary.success_parcel} />
                <MetricCard
                  label="Cancelled"
                  value={summary.cancelled_parcel}
                  accent="text-rose-600"
                />
              </div>
            </div>
          )}

          {courierEntries.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 text-center">
                Courier Status
              </p>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr className="h-10 text-[10px] lg:text-sm font-normal text-center bg-sky-500 text-white">
                      <th>Courier</th>
                      <th>Total</th>
                      <th>Success</th>
                      <th>Cancelled</th>
                      <th>Success Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {courierEntries.map(([key, courier]) => (
                      <tr
                        key={key}
                        className="h-10 text-[10px] lg:text-sm text-nowrap font-normal text-center"
                      >
                        <td className="">
                          <div className="flex items-center gap-3">
                            <img
                              src={courier?.logo}
                              alt={courier?.name}
                              className="w-14 object-cover"
                            />
                          </div>
                        </td>
                        <td className="text-slate-900">
                          {courier?.total_parcel ?? 0}
                        </td>
                        <td className="text-emerald-600">
                          {courier?.success_parcel ?? 0}
                        </td>
                        <td className="text-rose-600">
                          {courier?.cancelled_parcel ?? 0}
                        </td>
                        <td className="text-sky-700">
                          {courier?.success_ratio ?? 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reports.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <RiTimeLine />
                Reports
              </div>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-xl border border-amber-200 bg-amber-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={report.courierLogo}
                        alt={report.courierName}
                        className="h-10 w-10 rounded-lg border border-amber-100 bg-white object-contain p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {report.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {report.courierName}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {report.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ label, value, accent = "text-black" }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${accent}`}>{value}</p>
    </div>
  );
};

export default CourierFraudCheck;
