import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const GetFooter = () => {
  const [footerData, setFooterData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [footerId, setFooterId] = useState(null);  // Add a state for the footer ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `https://dailyshopping-backend.onrender.com/api/footer`;
        console.log("Fetching from:", apiUrl);

        const response = await fetch(apiUrl);

        // Ensure response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const result = await response.json();
        console.log("Fetched Data:", result);  // Log the entire response

        // Ensure the response has the data structure we expect
        if (result && result.length > 0) {
          console.log("Footer Object:", result[0].footer);  // Log footer object
          console.log("Header Object:", result[0].header);  // Log header object

          setFooterData(result[0].footer); // Store the footer object
          setHeaderData(result[0].header); // Store the header object
          setFooterId(result[0]._id); // Store the footer ID
          console.log("Footer ID:", result[0]._id); // Log the ID
        } else {
          console.warn("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!footerData || !headerData) return <p className="text-center">No data available</p>;

  return (
    <section className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <h2 className="text-lg md:text-2xl font-semibold text-center mb-5">Header & Footer Information</h2>

        {/* Header Section */}
        <div className="bg-blue-100 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Header</h3>
          <p><strong>Phone:</strong> {headerData.phone}</p>
          <p><strong>Order Now Text:</strong> {headerData.orderNowText}</p>
          <p><strong>Order Message:</strong> {headerData.orderMessage}</p>
          <p><strong>View All Message:</strong> {headerData.viewAllMessage}</p>
          <p><strong>View All Button:</strong> {headerData.viewAllButton}</p>
          <p><strong>View All Button:</strong> {headerData.background}</p>
          <p><strong>View All Button:</strong> {headerData.color}</p>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Footer Contact</h3>
          <p><strong>Address:</strong> {footerData.contact?.address}</p>
          <p><strong>Phone:</strong> {footerData.contact?.phone}</p>
          <p><strong>Email:</strong> {footerData.contact?.email}</p>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-100 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul>
            {footerData.quickLinks?.map((link, index) => (
              <li key={index} className="flex items-center gap-2">
                <span>{link.icon}</span> {link.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Options */}
        <div className="bg-gray-100 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Payment Options</h3>
          <div className="flex gap-3">
            {footerData.paymentOptions?.map((img, index) => (
              <img key={index} src={img} alt="Payment Option" className="h-10" />
            ))}
          </div>
        </div>

        {/* Courier Partners */}
        <div className="bg-gray-100 p-5 rounded-md mb-5">
          <h3 className="text-xl font-semibold mb-2">Courier Partners</h3>
          <div className="flex gap-3">
            {footerData.courierPartners?.map((img, index) => (
              <img key={index} src={img} alt="Courier Partner" className="h-10" />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gray-100 p-5 rounded-md text-center">
          <p>© {new Date().getFullYear()} {footerData.copyright?.owner}</p>
        </div>

        {/* Edit Button */}
        <div className="text-center mt-5">
          {footerId ? (  // Check if footerId is available
            <NavLink to={`/dashboard/editfooter/${footerId}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center gap-2">
                <FaPencilAlt /> Edit Footer
              </button>
            </NavLink>
          ) : (
            <p>Loading footer...</p> // Show loading message until footerId is available
          )}
        </div>

      </div>
    </section>
  );
};

export default GetFooter;
