import { motion } from "framer-motion";
import PropTypes from "prop-types";

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-12"
      >
        {children}
      </motion.main>
    </div>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageWrapper;
