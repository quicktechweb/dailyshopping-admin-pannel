import { FaPaperPlane } from "react-icons/fa";

const stories = [
  { name: "You", img: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Jakaria hossain", img: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Akash sarkar ali", img: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Hasanur Rahman", img: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
  { name: "Rakibul hasan", img: "https://i.ibb.co/ZR7RC2Kq/man-vector.png" },
];

const HomeMiddlePart = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-2 sm:px-4 bg-white rounded-md shadow-sm pt-2">
      {/* Top Story Avatars Row */}
      <div className="flex justify-between py-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <div
            key={index}
            className="flex flex-col items-center ms-3 me-3 sm:ms-5 sm:me-4 space-y-1 flex-shrink-0"
          >
           <div className="w-10 ms-5 h-10 sm:w-14 sm:h-14 border border-gray-300 rounded-full overflow-hidden">
  <img
    src={story.img}
    alt={story.name}
    className="w-full h-full object-cover rounded-full mt-2"
  />
</div>


            
          </div>
        ))}
      </div>

      {/* Story Cards Section */}
      <div className="flex space-x-3 mt-2 overflow-x-auto py-2 px-1 sm:px-4 scrollbar-hide">
        <div className="flex-shrink-0 w-20 sm:w-32 bg-white rounded-xl shadow p-2 text-center">
          <div className="w-full h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl sm:text-4xl text-red-500">
            +
          </div>
          <p className="text-xs font-semibold text-gray-700 mt-2">
            Post a Story
          </p>
        </div>

        {/* Other Stories */}
        {stories.slice(1).map((story, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-24 sm:w-28 bg-white rounded-xl shadow p-2 text-center"
          >
            <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden">
              <img
                src={story.img}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Post Input */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow flex items-start space-x-3 sm:space-x-4">
        <img
          src="https://i.ibb.co/ZR7RC2Kq/man-vector.png"
          alt="User"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="What’s on your mind?"
            className="w-full p-2 bg-gray-100 rounded-lg outline-none text-sm"
          />
          <div className="flex justify-end mt-2">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-black text-sm">
              <span className="text-xl">🎬</span>
              <span>Reels</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-xl shadow space-y-4">
        {/* Post Header */}
        <div className="flex items-center space-x-3">
          <img
            src="https://i.ibb.co/ZR7RC2Kq/man-vector.png"
            alt="Md. Ariful islam"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Md. Ariful islam
            </p>
            <p className="text-xs text-gray-500">
              Motion Graphic Designer at Social Twist • 2hr
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-800">
          Social Twist is one of the best social media platforms for connecting
          with friends, sharing content, and promoting businesses. It offers a
          wide range of features, including posts, stories, live videos, and
          marketplace options.
        </p>

        <img
          src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7"
          alt="Post"
          className="w-full h-56 sm:h-72 rounded-lg object-cover"
        />

        <div className="flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-2">
          <button className="hover:text-red-500">⭐ Stars (120)</button>
          <button>💬 Comments (15)</button>
          <button>🔁 Share (10)</button>
        </div>

        {/* Comment Input with Send Icon */}
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Add a comment"
            className="w-full p-2 pr-10 bg-gray-100 rounded-lg outline-none text-sm"
          />
          <button className="absolute  right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-black">
             <FaPaperPlane className="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeMiddlePart;
