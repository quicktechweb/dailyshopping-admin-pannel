import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const image_hosting_key = "9aa445fc9b5e81a67e633b362bec2003";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditProjectHome = () => {
  const [banner, setBanner] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const { id } = useParams();

  // Fetch banner data
  useEffect(() => {
    fetch(`http://localhost:5000/editProjectHome/${id}`)
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch((error) => console.error("Error fetching banner:", error));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanner((prevBanner) => ({
      ...prevBanner,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Upload image to imgbb and get the URL
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(image_hosting_api, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data?.data?.url) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    let updatedBanner = { ...banner };

    // Upload image if new file is selected
    if (imageFile) {
      try {
        const imageUrl = await uploadImage(imageFile);
        updatedBanner.image = imageUrl; // Update backgroundImage with the new image URL
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Image Upload Failed",
          text: error.message,
        });
        return;
      }
    }

    // Send the updated data to the server
    fetch(`http://localhost:5000/projecthomeupdate/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBanner),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Update Success",
            text: "Project updated successfully!",
          });
        }
      })
      .catch((error) => console.error("Error updating banner:", error));
  };

  return (
    <div>
      <div className="py-5 md:px-64">
        <div className="container">
          <div>
            <div
              className="relative login-form text-center shadow"
              style={{ borderRadius: "20px" }}
            >
              <Link to={-1}>
                <FaArrowLeft className="relative top-2 left-2 text-[#01c0c9] bg-primary text-3xl p-2 rounded-full duration-300 active:scale-90 cursor-pointer select-none" />
              </Link>
              <h2 className="mb-5 text-black text-3xl font-semibold">
                Update Home Project
              </h2>
              <form onSubmit={handleUpdate}>
                <input
                  onChange={handleChange}
                  value={banner.title}
                  style={{
                    fontWeight: "600",
                    color: "#0E1621",
                    height: "60px",
                  }}
                  className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                  placeholder="Title"
                  name="title"
                />
                <br />
                <textarea
                  onChange={handleChange}
                  value={banner.description}
                  style={{
                    fontWeight: "600",
                    color: "#0E1621",
                    height: "80px",
                  }}
                  className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                  placeholder="Description"
                  name="description"
                />
                <br />
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="input-file border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                />
                <br />
                <button
                  className="bg-[#01c0c9] font-semibold text-white mt-5 mb-10 px-6 py-2 text-xl rounded-2xl"
                  type="submit"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectHome;
