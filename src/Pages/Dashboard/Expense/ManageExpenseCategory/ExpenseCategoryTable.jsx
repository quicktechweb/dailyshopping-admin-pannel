import PropTypes from "prop-types";

const ExpenseCategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-xl rounded-xl bg-white border border-gray-100">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-green-50 to-green-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-10 text-gray-400 font-medium"
              >
                🚫 No categories available
              </td>
            </tr>
          ) : (
            categories.map((cat, idx) => (
              <tr
                key={cat._id}
                className={`transition-all duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {cat.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      cat.status === "Active"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => onEdit(cat)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition duration-200"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(cat._id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg shadow hover:bg-red-700 hover:shadow-md transition duration-200"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// PropTypes validation
ExpenseCategoryTable.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ExpenseCategoryTable;
