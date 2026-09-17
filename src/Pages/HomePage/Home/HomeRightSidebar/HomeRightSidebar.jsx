
const HomeRightSidebar = () => {
  const whoToFollow = [
    {
      name: "Md. Ariful islam",
      role: "Graphic Designer",
      image: "https://i.ibb.co/ZR7RC2Kq/man-vector.png"
    },
    {
      name: "Sayeb ahmed",
      role: "Graphic Designer",
      image: "https://i.ibb.co/ZR7RC2Kq/man-vector.png"
    },
    {
      name: "Imran khan ali",
      role: "Graphic Designer",
      image: "https://i.ibb.co/ZR7RC2Kq/man-vector.png"
    },
    {
      name: "Ahmed Bin sojib",
      role: "Graphic Designer",
      image: "https://i.ibb.co/ZR7RC2Kq/man-vector.png"
    },
    {
      name: "Rakibul islam",
      role: "Graphic Designer",
      image: "https://i.ibb.co/ZR7RC2Kq/man-vector.png"
    }
  ];


  // const newsItems = [
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   },
  //   {
  //     title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
  //     time: "2hr"
  //   }
  // ];

  return (
    <div className="w-full max-w-xs space-y-6">
      {/* Who to follow */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Who to follow</h2>
        <ul className="space-y-3">
          {whoToFollow.map((user, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                <span className="text-xl leading-none font-bold">+</span>
              </button>
            </li>
          ))}
        </ul>
      <button className="text-sm bg-gray-100 text-red-500 px-5 py-2 rounded mx-auto block mt-4 hover:bg-gray-200 hover:underline">
  View more
</button>

      </div>

      {/* Today's News */}
      {/* <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today’s News</h2>
        <ul className="space-y-3">
          {newsItems.map((news, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              {news.title}
              <span className="block text-xs text-gray-400">{news.time}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default HomeRightSidebar;
