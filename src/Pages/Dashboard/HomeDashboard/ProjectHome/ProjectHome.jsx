// import React from 'react';

import axios from "axios";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";
import AddProject from "./AddProject";
import Swal from "sweetalert2";

const ProjectHome = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:5000/getprojecthome`
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/homeprojectdelete/${id}`)
          .then((response) => {
            response.status === 204 &&
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            const deleted = data.filter((d) => d._id !== id);
            setData(deleted);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };


  return (
    <>
      {loading || (
        <section>
       

          {/* 2nd part start  */}

          <div className="container mx-auto px-4 sm:px-8 overflow-x-scroll">
            <div className="py-8">
              <div className="flex items-center gap-5 my-5">
                <h2 className="text-lg md:text-2xl font-semibold leading-tight">
                  Project Features Part
                </h2>
                <AddProject />
              </div>
              <div className="min-w-[400px] md:min-w-[650px]">
                <div className="flex flexcol md:flex-row gap2 md:gap-0 items-center justify-around bg[#F3F4F6] py-3 my-3 rounded-md">
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                       title
                    </p>
                  </div>
                  <div className="w-[32%] -ms-3">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    candidates
                    </p>
                  </div>
                  <div className="w-[32%] ms-5">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    image
                    </p>
                  </div>
                  <p className="w-[32%] text-[#007cde] flex justify-center">
                    <p className="bg-[#007cde] md:w-[30%] w-[50%] text-center text-white px-3 py-1 rounded-full font-semibold">
                      Action
                    </p>
                  </p>
                </div>
                {data?.map((d, i) => (
                  <div
                    key={i}
                    className="flex flexcol md:flex-row items-center justify-around shadow shadow-[#007cde] py-3 my-3 rounded-md"
                  >
                    
                    <p className="w-[32%] text-center">
                      {d.title}
                    </p>
                   
                    <p className="w-[32%] text-left ms-8">
                      {d.description}
                    </p>

                    
      <div className="w-[32%] flex items-center justify-center -ms-6">
        <img 
          className="h-24 w-24" 
          src={d?.image} 
          alt="Banner" 
        />
      </div>
    
                  
                    <div className="w-[32%] flex items-center justify-center">
                      <NavLink
                        to={`/dashboard/editprojecthome/${d._id}`}
                        style={{
                          textDecoration: "none",
                          marginRight: "-10px",
                        }}
                      >
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#01c0c9] text-white text-xl duration-300 active:scale-90">
                          <FaPencilAlt />
                        </button>
                      </NavLink>
                      <button
                        onClick={() => handleDelete(d?._id)}
                        className="w-10 h-10 ml-4 rounded-full flex items-center justify-center bg-[#007cde] text-white text-xl duration-300 active:scale-90"
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectHome;
