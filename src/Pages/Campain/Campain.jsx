import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dailyshopping-backend.onrender.com/api/products/campaindata")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCampaigns(data.campaigns);
      });
  }, []);

  return (
    <div className="w-full max-w-[1380px] px-4 sm:px-6 md:px-10 lg:px-20 mx-auto mb-20 mt-12">
      
      {/* Page Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-12">
        Featured Campaigns
      </h1>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        
        {campaigns.map(c => (
          <div
            key={c._id}
            onClick={() => navigate(`/campaigns/${c._id}`)}
            className="
              relative cursor-pointer rounded-2xl overflow-hidden 
              shadow-lg hover:shadow-2xl transition-all duration-300
              group transform hover:-translate-y-2 hover:scale-[1.02]
            "
          >
            {/* Campaign Image */}
            <img
              src={c.campaignImg}
              alt={c.campaignName}
              className="w-full h-60 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Glass Bottom Title */}
            <div className="
              absolute bottom-0 w-full px-4 py-3 
              backdrop-blur-sm bg-white/10 border-t border-white/20
              text-center
            ">
              <h2 className="text-white font-semibold text-lg truncate tracking-wide">
                {c.campaignName}
              </h2>
            </div>

            {/* Glow Border on Hover */}
            <div
              className="
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
              transition duration-300 pointer-events-none
              border border-white/20 group-hover:border-blue-400 shadow-[0_0_20px_rgba(0,123,255,0.5)]
            "
            ></div>
          </div>
        ))}

      </div>
    </div>
  );
}
