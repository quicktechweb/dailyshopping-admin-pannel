import PropTypes from "prop-types";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`flex-shrink-0 px-1 mt-3 ${className} animate-pulse`}
    >
      <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-44 w-full rounded-md mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-200 rounded w-full" />
        <div className="flex gap-2 mt-2">
          <div className="h-7 bg-gray-200 rounded flex-1" />
          <div className="h-7 bg-gray-200 rounded flex-1" />
        </div>
      </div>
    </div>
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;
