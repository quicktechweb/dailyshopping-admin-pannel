import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const image_hosting_key = "87e8c93db3b7d5540df8a8f00585cbe9";
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddPost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");  // To store the image URL after upload

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const { register, handleSubmit, reset } = useForm();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      
      try {
        const response = await axios.post(image_hosting_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Get the image URL from ImgBB
        setImageUrl(response.data.data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const onSubmit = async (data) => {
    // Add the image URL to the form data
    const formData = {
        home: data.home,
      about: data.about,
      contact: data.contact,
      offer: data.offer,
      allads: data.allads,
      career: data.career,
      image: imageUrl, // Attach the image URL here
    };

    try {
      await axios.post(`http://localhost:5000/postaddnavber`, formData);  // Adjust the URL to your backend API
      Swal.fire({
        icon: "success",
        title: "Post Success",
        text: "Project Add successfully!",
      });
      reset();  // Reset the form
      setImageUrl("");  // Reset image URL
    } catch (error) {
      console.error("Error adding banner:", error);
      alert("Error adding banner.");
    }
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="block text-white bg-[#007cde] hover:bg-[#007cde] hover:scale-105 active:scale-90 duration-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#007cde] dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
        type="button"
      >
        Add Navber
      </button>

      {isOpen && (
        <div
          id="crud-modal"
          className="fixed  top-0 right-0 left-0 z-50 flex justify-center items-center h-screen bg-black bg-opacity-40 overflow-scroll"
        >
          <div className="relative p-4 w-full max-w-xl bg-white rounded-lg shadow-md">
            <div className="md:mt-32 mt-52 mb-6 ">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h2 className="text-xl font-semibold text-black">Add Your Navber</h2>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="py-5 px-8">
                <div className="text-center">
                  <form onSubmit={handleSubmit(onSubmit)} style={{ borderRadius: "20px" }}>
                    <input
                      {...register("home", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="home"
                    />
                    <br />
                    <input
                      {...register("about", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="about"
                    />
                    <br />
                    <input
                      {...register("allads", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="allads"
                    />
                    <br />
                    <input
                      {...register("career", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="career"
                    />
                    <br />
                    <input
                      {...register("offer", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="offer"
                    />
                    <br />
                    <input
                      {...register("contact", { required: true })}
                      style={{ fontWeight: "600", color: "#0E1621", height: "60px" }}
                      className="input input-text border-[2px] border-[#01c0c9] hover:border-[#007cde] rounded-3xl px-5 py-2 w-full input-wrapper md:min-w-[450px] max-w-[20.5rem] mx-2 text-xl mt-2"
                      placeholder="contact"
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
                      Add Banner
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPost;
