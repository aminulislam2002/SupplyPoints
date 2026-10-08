import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";

const SubmitPost = () => {
  const axiosSecure = useAxiosSecure();
  const [platform, setPlatform] = useState("YouTube");
  const [postLink, setPostLink] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postLink.trim()) {
      Swal.fire({
        title: "Validation",
        text: "Post link is required",
        icon: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosSecure.post("/post-submissions", {
        platform,
        postLink,
        note,
      });
      await Swal.fire({
        title: res.data.message || "Submitted",
        icon: "success",
      });
      setPlatform("YouTube");
      setPostLink("");
      setNote("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || err.message,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="card p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Submit Promotion Post</h1>
        <p className="text-sm text-text-secondary mt-1">
          Submit your promoted post link for review (YouTube, Facebook, etc.)
        </p>
      </div>

      {/* Instruction Section */}
      <div className="card p-5 sm:p-6 shadow-sm mt-4">
        <h2 className="text-xl font-bold text-primary-400 mb-3">
          ভিডিও বানিয়ে ইনকাম করুন ৫০০ টাকা পর্যন্ত!
        </h2>
        <div className="space-y-3 text-text-primary text-sm sm:text-base leading-relaxed">
          <p>
            আপনি কি কন্টেন্ট ক্রিয়েটর? আমাদের প্ল্যাটফর্ম নিয়ে ভিডিও বানিয়ে
            জিতে নিন ২০ টাকা থেকে ৫০০ টাকা পর্যন্ত নিশ্চিত পুরষ্কার! আপনার তৈরি
            করা ভিডিওর লিংক আমাদের সাইটে সাবমিট করলেই আমাদের টিম সেটি রিভিউ করে
            আপনাকে পেমেন্ট করে দিবে।
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li>
              ভিডিওটি অবশ্যই ইউটিউব (YouTube), ফেসবুক (Facebook) অথবা টিকটক
              (TikTok)-এ আপলোড করতে হবে।
            </li>
            <li>
              ভিডিওতে আমাদের ওয়েবসাইট Supply Points-এর রিসেলিং সুবিধা,
              প্রোডাক্ট কালেকশন এবং কীভাবে ইনকাম করা যায়—এই বিষয়গুলো
              সুন্দরভাবে ফুটিয়ে তুলতে হবে।
            </li>
            <li>
              ভিডিওর সাউন্ড এবং পিকচার কোয়ালিটি যত ভালো হবে এবং তথ্য যত নির্ভুল
              হবে, আপনার পুরষ্কারের অংক তত বেশি হওয়ার সম্ভাবনা থাকবে।
            </li>
          </ul>
          <p className="font-medium text-primary-300">
            ভিডিও পাবলিক করার পর সেই লিংকটি আমাদের ওয়েবসাইটের নির্দিষ্ট ফরমে
            সাবমিট করুন।
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="card p-5 sm:p-6 shadow-sm mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full mt-2 h-10 px-3 surface-muted rounded-md text-white focus:outline-none focus:ring-1 focus:ring-primary-600"
            >
              <option className="bg-card-bg">YouTube</option>
              <option className="bg-card-bg">Facebook</option>
              <option className="bg-card-bg">TikTok</option>
              <option className="bg-card-bg">Instagram</option>
              <option className="bg-card-bg">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Post Link
            </label>
            <input
              value={postLink}
              onChange={(e) => setPostLink(e.target.value)}
              className="w-full mt-2 h-10 px-3 surface-muted rounded-md text-white focus:outline-none focus:ring-1 focus:ring-primary-600"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mt-2 px-3 py-2 surface-muted rounded-md text-white focus:outline-none focus:ring-1 focus:ring-primary-600"
              rows={4}
              placeholder="অতিরিক্ত কোনো তথ্য থাকলে এখানে লিখুন..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn primary-btn w-full sm:w-auto px-6 py-2.5 rounded-md text-white font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPost;
