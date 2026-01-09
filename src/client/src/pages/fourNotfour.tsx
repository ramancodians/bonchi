import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const FourNotFour: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Bonchi</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="text-center max-w-2xl">
          {/* 404 Large Text */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          </div>

          {/* Error Icon */}
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-base-content/70 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGoBack} className="btn btn-primary btn-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>

            <Link to="/" className="btn btn-outline btn-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>
          </div>

          {/* Additional Help Text */}
          <div className="mt-12">
            <p className="text-sm text-base-content/50">
              If you believe this is an error, please{" "}
              <Link to="/contact" className="link link-primary">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FourNotFour;
