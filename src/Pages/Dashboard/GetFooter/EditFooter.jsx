import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const image_hosting_key = "746adaf1da9a1a48b000bec014639aeb";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditFooter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [footerData, setFooterData] = useState({
    header: {
      phone: "",
      orderNowText: "",
      orderMessage: "",
      viewAllMessage: "",
      viewAllButton: ""
    },
    footer: {
      contact: { address: "", phone: "", email: "" },
      quickLinks: [],
      paymentOptions: [],
      courierPartners: [],
      copyright: { owner: "" }
    }
  });

  // Fetch footer data
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`https://dailyshopping-backend.onrender.com/footer/${id}`);
        const result = await response.json();
        if (result) {
          setFooterData(result);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    fetchFooterData();
  }, [id]);

  // Handle text input changes
  const handleChange = (section, field, value) => {
    setFooterData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle nested contact changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFooterData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        contact: { ...prev.footer.contact, [name]: value }
      }
    }));
  };

  // Handle quick links
  const handleQuickLinkChange = (index, field, value) => {
    const updatedQuickLinks = [...footerData.footer.quickLinks];
    updatedQuickLinks[index][field] = value;
    setFooterData((prev) => ({
      ...prev,
      footer: { ...prev.footer, quickLinks: updatedQuickLinks }
    }));
  };

  const addQuickLink = () => {
    setFooterData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: [...prev.footer.quickLinks, { title: "", icon: "" }]
      }
    }));
  };

  const removeQuickLink = (index) => {
    setFooterData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: prev.footer.quickLinks.filter((_, i) => i !== index)
      }
    }));
  };

   // Handle copyright owner change
   const handleCopyrightChange = (e) => {
    const { value } = e.target;
    setFooterData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        copyright: { ...prev.footer.copyright, owner: value }
      }
    }));
  };

  // Handle image upload for payment options and courier partners
  const handleImageUpload = async (e, section, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(image_hosting_api, {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        const updatedData = [...footerData.footer[section]];
        updatedData[index] = result.data.url;  // Update the specific image URL
        setFooterData((prev) => ({
          ...prev,
          footer: { ...prev.footer, [section]: updatedData }
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Footer Data to be updated:", footerData);
    console.log("Footer ID:", id);

    try {
      const response = await fetch(`https://dailyshopping-backend.onrender.com/footer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(footerData),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (response.ok) {
        alert("Footer updated successfully!");
        navigate("/dashboard");
      } else {
        alert(`Error: ${result.error || 'Error updating footer. Please try again.'}`);
      }
    } catch (error) {
      console.error("Error updating footer:", error);
      alert("Error updating footer. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Footer</h2>
      <form onSubmit={handleSubmit}>

        {/* Header Section */}
        <h3 className="text-lg font-semibold mb-2">Header</h3>
        {Object.keys(footerData.header).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={footerData.header[field]}
              onChange={(e) => handleChange("header", field, e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}

        {/* Footer Contact */}
        <h3 className="text-lg font-semibold mb-2">Footer Contact</h3>
        {Object.keys(footerData.footer.contact).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={footerData.footer.contact[field]}
              onChange={handleContactChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ))}

         {/* Copyright Owner Section */}
         <h3 className="text-lg font-semibold mb-2">Copyright Owner</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium">Owner</label>
          <input
            type="text"
            value={footerData.footer.copyright.owner}
            onChange={handleCopyrightChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Quick Links */}
        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
        {footerData.footer.quickLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Title"
              value={link.title}
              onChange={(e) => handleQuickLinkChange(index, "title", e.target.value)}
              className="p-2 border rounded-md w-1/2"
            />
            <input
              type="text"
              placeholder="Icon"
              value={link.icon}
              onChange={(e) => handleQuickLinkChange(index, "icon", e.target.value)}
              className="p-2 border rounded-md w-1/4"
            />
            <button type="button" onClick={() => removeQuickLink(index)} className="text-red-500">✖</button>
          </div>
        ))}
        <button type="button" onClick={addQuickLink} className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4">
          Add Quick Link
        </button>

        {/* Payment Options */}
        <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
        <div className="mb-4">
          {footerData.footer.paymentOptions.map((img, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "paymentOptions", index)}
                className="p-2 border rounded-md"
              />
              <img src={img} alt={`Payment Option ${index + 1}`} className="w-24 h-24 object-cover" />
            </div>
          ))}
        </div>

        {/* Courier Partners */}
        <h3 className="text-lg font-semibold mb-2">Courier Partners</h3>
        <div className="mb-4">
          {footerData.footer.courierPartners.map((img, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "courierPartners", index)}
                className="p-2 border rounded-md"
              />
              <img src={img} alt={`Courier Partner ${index + 1}`} className="w-24 h-24 object-cover" />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditFooter;
