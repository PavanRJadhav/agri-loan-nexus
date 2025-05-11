
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-block rounded bg-primary px-4 py-2 text-white hover:bg-primary/90">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
