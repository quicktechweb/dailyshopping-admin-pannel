import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-[rgb(17,24,39)] flex flex-col justify-center items-center text-white">
      {/* Error Code */}
      <h1 className="text-9xl font-extrabold mb-6">400</h1>

      {/* Error Message */}
      <h2 className="text-3xl md:text-4xl font-semibold mb-4">
        Bad Request
      </h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        The server could not understand the request due to invalid syntax.
        Please check your input and try again.
      </p>

      {/* Navigation Button */}
      <Link
        to="/"
        className="bg-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 transition duration-300"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
