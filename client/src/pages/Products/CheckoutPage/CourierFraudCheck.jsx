import { useMemo, useState } from "react";
import axios from "axios";
import {
  RiAlertLine,
  RiLoader4Line,
  RiSearch2Line,
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
    <section className="relative w-full h-auto overflow-hidden rounded-xl border border-border-color bg-card-bg shadow-md">
      {/* Header Section */}
      <div className="bg-linear-to-r from-primary-700 to-primary-600 p-4 lg:p-6 text-primary-50 space-y-1.5">
        <h1 className="text-xl font-semibold leading-tight text-center lg:text-left">
          প্রতারণা যাচাই
        </h1>
        <p className="text-xs font-normal text-text-secondary text-center lg:text-left">
          ফোনের মাধ্যমে কুরিয়ার অর্ডারের ইতিহাস ও সফলতার হার যাচাই করুন।
        </p>
      </div>

      <div className="p-4 lg:p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-primary">
              Customer Phone
            </label>
            {/* Input and Search Button Side-by-Side */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 flex h-11 items-center overflow-hidden rounded-lg border border-border-color bg-card-bg shadow-inner focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                  <RiSearch2Line className="h-5 w-5" />
                </div>
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
                  placeholder="01XXXXXXXXX"
                  className="h-full w-full border-0 bg-transparent pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
                />
              </div>

              {/* Separate Search Button on Right Side */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn primary-btn"
              >
                {isLoading ? (
                  <RiLoader4Line className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Search</span>
                    <span className="text-base leading-none">→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              <RiAlertLine className="mt-0.5 shrink-0 text-base" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Dynamic Results Section */}
        {(summary || courierEntries.length > 0 || reports.length > 0) && (
          <div className="space-y-5 rounded-xl border border-border-color bg-section-bg p-5">
            {summary && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary text-center">
                  Live Summary
                </p>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <MetricCard
                    label="Total Parcel"
                    value={summary.total_parcel}
                  />
                  <MetricCard
                    label="Success Ratio"
                    value={`${summary.success_ratio}%`}
                    accent="text-primary-600"
                  />
                  <MetricCard label="Success" value={summary.success_parcel} />
                  <MetricCard
                    label="Cancelled"
                    value={summary.cancelled_parcel}
                    accent="text-danger"
                  />
                </div>
              </div>
            )}

            {courierEntries.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary text-center">
                  Courier Status
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm table-auto border-collapse">
                    <thead>
                      <tr className="h-10 text-xs font-semibold text-center bg-primary-700 text-primary-50">
                        <th className="px-3 first:rounded-tl-md last:rounded-tr-md">
                          Courier
                        </th>
                        <th className="px-3">Total</th>
                        <th className="px-3">Success</th>
                        <th className="px-3">Cancelled</th>
                        <th className="px-3">Success Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      {courierEntries.map(([key, courier]) => (
                        <tr
                          key={key}
                          className="h-12 text-sm text-nowrap font-normal text-center bg-card-bg hover:bg-secondary-50"
                        >
                          <td className="px-3 align-middle">
                            <div className="flex items-center justify-center gap-3">
                              <img
                                src={courier?.logo}
                                alt={courier?.name}
                                className="h-8 w-8 object-contain"
                              />
                            </div>
                          </td>
                          <td className="px-3 align-middle text-text-primary">
                            {courier?.total_parcel ?? 0}
                          </td>
                          <td className="px-3 align-middle text-primary-600 font-medium">
                            {courier?.success_parcel ?? 0}
                          </td>
                          <td className="px-3 align-middle text-danger font-medium">
                            {courier?.cancelled_parcel ?? 0}
                          </td>
                          <td className="px-3 align-middle text-info font-medium">
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
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
                  <RiTimeLine className="text-sm" />
                  Reports
                </div>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="rounded-xl border border-warning/25 bg-warning/10 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={report.courierLogo}
                          alt={report.courierName}
                          className="h-12 w-12 rounded-lg border border-warning/20 bg-card-bg object-contain p-1.5"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {report.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {report.courierName}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-text-secondary">
                        {report.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const MetricCard = ({ label, value, accent = "text-text-primary" }) => {
  return (
    <div className="rounded-lg border border-border-color bg-card-bg p-3 text-center shadow-sm">
      <p className="text-xs text-text-secondary font-medium">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
};

export default CourierFraudCheck;
