import { Link } from "react-router-dom";

const menuItems = [
  { name: "Home", icon: "🏠" , path: "/"},
  { name: "Reels", icon: "👤" , path: "/reels"},
  { name: "Message", icon: "💬", path: "/chat" },
  { name: "Friends", icon: "👥",  path: "/friend" },
  { name: "Group", icon: "👪" , path: "/group"},
  { name: "Marketplace", icon: "🛒" ,path: "/marketplace"},
  { name: "Market Book", icon: "📚" , path: "/allproductlist"},
];

const onlineContacts = [
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Md. Ariful islam", avatar: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
];

const HomeLeftSidebar = () => {
  return (
    <div className="w-full md:max-w-[250px] flex flex-col gap-4  -mt-3">
      {/* Top Menu Card */}
      <div className="bg-white rounded-xl shadow-md p-4 hidden md:block">
       <div className="space-y-4">
      {menuItems.map((item, index) => (
        <Link to={item.path} key={index}>
          <div className="flex items-center gap-3 mt-2 p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
            <span className="text-xl">{item.icon}</span>
            <span className="text-md font-medium text-gray-700">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
      </div>

      {/* Mobile View (horizontal icons only) */}
 <div className="bg-white shadow-md p-2 mt-[65px] md:hidden text-left">
      <div className="flex items-center gap-6 justify-start">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <div className="text-xl cursor-pointer">
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>


      {/* Online Contacts Card */}
     <div className="p-4 md:p-0 hidden md:block">
       <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Online Contacts
          </h3>
          <span className="text-xl cursor-pointer">⋯</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
          {onlineContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-700">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
     </div>
    </div>
  );
};

export default HomeLeftSidebar;
