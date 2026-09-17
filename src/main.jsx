import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx";
import AuthProvider from "./Pages/Shared/Context/AuthProvider.jsx";
import { TranslationProvider } from "./Pages/Shared/Context/TranslationContext.jsx";
import CartContextProvider from "./Pages/Shared/Context/CartContext.jsx";
import { NotificationProvider } from "./Pages/Shared/Context/NotificationContext.jsx";
import PixelTracker from "./PixelTracker/PixelTracker.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GtmTracker from "./PixelTracker/GtmTracker.jsx";
// import axios from "axios"; 




const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min cache
      cacheTime: 1000 * 60 * 30, // 30 min cache
      refetchOnWindowFocus: false, // optional background refetch
      retry: 2, // retry failed requests twice
    },
  },
});

// axios.defaults.withCredentials = true;
const GTM_ID = "GTM-W4VWGTMT";

function AppWithPixel() {
  return (
     <QueryClientProvider client={queryClient}>
      <TranslationProvider>
      <AuthProvider>
        <CartContextProvider>
          <NotificationProvider>
            <RouterProvider router={router} fallbackElement={<div>Loading...</div>}>
              <PixelTracker /> {/* Must be inside Router context */}
               <GtmTracker gtmId={GTM_ID} />
            </RouterProvider>
          </NotificationProvider>
        </CartContextProvider>
      </AuthProvider>
    </TranslationProvider>

     </QueryClientProvider>
    
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWithPixel />
  </React.StrictMode>
);
