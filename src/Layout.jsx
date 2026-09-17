import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Pages/Shared/Footer/Footer";
import DetailsNavbar from "./Pages/Shared/Navbar/DetailsNavbar"; // import your mobile navbar

const Layout = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isProductDetailsRoute = location.pathname.startsWith("/productdetails");

  

  return (
    <>
     <div className="flex flex-col min-h-screen">
      {/* Desktop Navbar always */}
      <div className="hidden sm:block">
        {/* <Navbar /> */}
      </div>

      {/* Mobile Navbar for product details */}
      {isProductDetailsRoute && (
        <div className="sm:hidden">
          <DetailsNavbar />
        </div>
      )}

      {/* Default mobile navbar for other routes */}
      {!isProductDetailsRoute && (
        <div className="sm:hidden">
          {/* <Navbar /> */}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {/* Footer */}
{/* Footer */}
{!isDashboardRoute && (
  <>
    {/* Product Details → Desktop only */}
    {isProductDetailsRoute ? (
      <footer className="hidden sm:block">
        <Footer />
      </footer>
    ) : (
      /* Other routes → All devices */
      <footer>
        {/* <Footer /> */}
      </footer>
    )}
  </>
)}


    </div>
    </>
  );
};

export default Layout;
