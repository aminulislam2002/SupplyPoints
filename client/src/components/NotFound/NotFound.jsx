import { Link } from "react-router";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon & Number */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-700 mb-6 shadow-sm">
            <FaExclamationTriangle className="text-5xl text-primary-50" />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-primary-600 mb-4">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-text-secondary mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-base text-text-secondary">
            It might have been moved or deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="btn btn-primary px-8 py-4"
          >
            <FaHome size={20} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline px-8 py-4"
          >
            <MdArrowBack size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
