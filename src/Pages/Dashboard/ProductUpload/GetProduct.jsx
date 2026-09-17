// import React from 'react';

import axios from "axios";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const GetProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://dailyshopping-backend.onrender.com/getproducts`
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
          .delete(`https://dailyshopping-backend.onrender.com/productdatadelete/${id}`)
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
                   offer Part
                </h2>
              </div>
              <div className="min-w-[400px] md:min-w-[650px]">
                <div className="flex flexcol md:flex-row gap2 md:gap-0 items-center justify-around bg[#F3F4F6] py-3 my-3 rounded-md">
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                       title
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    size
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    code
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    stock
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    Category
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    related
                    </p>
                  </div>
                  <div className="w-[32%] -ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    ProductPrice
                    </p>
                  </div>
                  <div className="w-[32%] ms-2">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    description
                    </p>
                  </div>
                 
                  <div className="w-[32%] ms-5">
                    <p className="text-[#007cde] shadow shadow-[#007cde] w-max mx-auto px-4 py-1 rounded-md font-semibold">
                    image
                    </p>
                  </div>
                
                </div>
                {data?.map((d, i) => (
                  <div
                    key={i}
                    className="flex flexcol md:flex-row items-center justify-around shadow shadow-[#007cde] py-3 my-3 rounded-md"
                  >
                    
                    <p className="w-[32%] text-center">
                      {d.title}
                    </p>
                    <p className="w-[32%] text-center">
                      {d.size}
                    </p>
                    
                    <p className="w-[32%] text-center">
                      {d.code}
                    </p>
                    <p className="w-[32%] text-center">
                      {d.stock}
                    </p>
                    <p className="w-[32%] text-center">
                      {d.category}
                    </p>
                    <p className="w-[32%] text-center">
                      {d.related}
                    </p>
                    <p className="w-[32%] text-center">
                      {d.ProductPrice}
                    </p>
                    <p className="w-[32%] ms-3 text-left border border-[#007cde] h-[130px] overflow-y-scroll overflow-x-hidden p-2 rounded-md">
                      {d.description}
                    </p>
                   
                   

                    
      <div className="w-[32%] flex items-center justify-center -ms-6">
        <img 
          className="h-24 w-24" 
          src={d?.images} 
          alt="Banner" 
        />
      </div>
    
                  
                    <div className="w-[32%] flex items-center justify-center">
                      <NavLink
                        to={`/dashboard/editproductdatas/${d._id}`}
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

export default GetProduct;
