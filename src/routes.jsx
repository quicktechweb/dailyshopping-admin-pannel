import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import DashboardHome from "./Pages/Dashboard/DashboardHome/DashboardHome";


// import PrivetRoute from "./Pages/Shared/PrivetRoute/PrivetRoute";

import ErrorPage from "./Pages/Shared/Errorpage";
import Layout from "./Layout";
import MakeAdmin from "./Pages/Dashboard/MakeAdmin/MakeAdmin";
import UserAllData from "./Pages/Dashboard/UserAllData/UserAllData";
import PendingProduct from "./Pages/Dashboard/PendingProduct/PendingProduct";
import BannerPost from "./Pages/Dashboard/BannerPost/BannerPost";
import EditBanners from "./Pages/Dashboard/BannerPost/EditBanners";
import AllProductShow from "./Pages/Dashboard/AllProductShow/AllProductShow";
// import PrivetRoute from "./Pages/Shared/PrivetRoute/PrivetRoute";
import SubAdmin from "./Pages/Dashboard/MakeAdmin/SubAdmin/SubAdmin";
import ProductUpload from "./Pages/Dashboard/ProductUpload/ProductUpload";
import EditNavber from "./Pages/Dashboard/GetNavber/EditNavber";
import GetFooter from "./Pages/Dashboard/GetFooter/GetFooter";
import EditFooter from "./Pages/Dashboard/GetFooter/EditFooter";
import GetProduct from "./Pages/Dashboard/ProductUpload/GetProduct";
import EditProduct from "./Pages/Dashboard/ProductUpload/EditProduct";
import UpdateOrder from "./Pages/Dashboard/UpdateOrder/UpdateOrder";
// import PrivateRoute from "./Pages/Shared/PrivetRoute/PrivetRoute";
import AllUserOrder from "./Pages/Dashboard/UpdateOrder/AllUserOrder";
import Login from "./Auth/Login/Login";
import Registration from "./Auth/Registration/Registration";
import OrderReview from "./Pages/HomePage/OrderReview/OrderReview";
import Payment from "./Pages/HomePage/Payment/Payment";
import AddCategory from "./Pages/Dashboard/CategoryPage/AddCategory/AddCategory";
import SubCategory from "./Pages/Dashboard/CategoryPage/SubCategory/SubCategory";
import ChildCategory from "./Pages/Dashboard/CategoryPage/ChildCategory/ChildCategory";
import AllUploadProduct from "./Pages/Dashboard/CategoryPage/AllUploadProduct/AllUploadProduct";
import UploadTopSelling from "./Pages/Dashboard/UploadTopSelling/UploadTopSelling";
import FooterDashboard from "./Pages/Dashboard/FooterDashboard/FooterDashbaord";
import MyProfile from "./Pages/Dashboard/UserDashboard/ProfileSetting/MyProfile/MyProfile";
import AddBrand from "./Pages/Dashboard/CategoryPage/AddBrand/AddBrand";
import InvoicePage from "./Pages/Dashboard/UpdateOrder/InvoicePage/InvoicePage";
import MyOrders from "./Pages/Dashboard/UserDashboard/MyOrder/MyOrders";
import SuperAdmin from "./Pages/Dashboard/MakeAdmin/SuperAdmin";
import AllCouponDataShow from "./Pages/CouponPannelAdmin/AllCouponData/AllCouponDataShow";
import AllRevenuedata from "./Pages/Dashboard/AdminAllRevenue/AllRevenuedata/AllRevenuedata";
import ManageExpenseCategory from "./Pages/Dashboard/Expense/ManageExpenseCategory/ManageExpenseCategory";
import ExpenseManager from "./Pages/Dashboard/Expense/OverViewExpense/ExpenseManager";
import SalesReportAnalysis from "./Pages/Dashboard/SalesReportAnalysis/SalesReportAnalysis";
import AdminTopSellProductView from "./Pages/Dashboard/AdminTopSellProductView/AdminTopSellProductView";
import AllStockManagement from "./Pages/Dashboard/AdminDashboard/StockManegement/AllStockManagement/AllStockManagement";
import LowStock from "./Pages/Dashboard/AdminDashboard/StockManegement/LowStock/LowStock";
import StockOut from "./Pages/Dashboard/AdminDashboard/StockManegement/StockOut/StockOut";
import PrivateRoute from "./Pages/Shared/PrivetRoute/PrivetRoute";
import UserOverView from "./Pages/Dashboard/UserDashboard/UserOverView/UserOverView";
import ActiveCoupon from "./Pages/Dashboard/UserDashboard/UserOverView/ActiveCoupon/ActiveCoupon";
import TotalCoupons from "./Pages/Dashboard/UserDashboard/UserOverView/TotalCoupons/TotalCoupons";
import TotalWins from "./Pages/Dashboard/UserDashboard/UserOverView/TotalWins/TotalWins";
import Wallet from "./Pages/Dashboard/UserDashboard/UserOverView/Wallet/Wallet";
import Withdraw from "./Pages/Dashboard/UserDashboard/UserOverView/Withdraw/Withdraw";
import SupplierPage from "./Pages/Dashboard/AdminDashboard/SupplierForm/SupplierPage";
import SupplierList from "./Pages/Dashboard/AdminDashboard/SupplierForm/SupplierList/SupplierList";
import SupplierEdit from "./Pages/Dashboard/AdminDashboard/SupplierForm/SupplierEdit/SupplierEdit";
import SupplierPayment from "./Pages/Dashboard/AdminDashboard/SupplierForm/SupplierPayment/SupplierPayment";
import SupplierInvoice from "./Pages/Dashboard/AdminDashboard/SupplierForm/SupplierInvoice/SupplierInvoice";
import PurchaseEntry from "./Pages/Dashboard/AdminDashboard/SuppliePurchase/PurchaseEntry/PurchaseEntry";
import PurchaseList from "./Pages/Dashboard/AdminDashboard/SuppliePurchase/PurchaseList/PurchaseList";
import Noti from "./Pages/HomePage/Notifications/Noti";
import SendNotification from "./Pages/HomePage/Notifications/SendNotification";
import AdminSendNotification from "./Pages/Dashboard/AdminDashboard/AdminSendNotification/AdminSendNotification";
import CustomerReviews from "./Pages/CustomerReviews/CustomerReviews";
import AboutUsAdmin from "./Pages/Dashboard/AdminDashboard/AboutUsAdmin/AboutUsAdmin";
import ContactAdmin from "./Pages/Dashboard/AdminDashboard/ContactAdmin/ContactAdmin";
import ProductForm from "./Pages/TextEditor/Productfrom";
import TermsConditionAdmin from "./Pages/Dashboard/AdminDashboard/TermsConditionAdmin/TermsConditionAdmin";
import ShippingPolicyAdmin from "./Pages/Dashboard/AdminDashboard/ShippingPolicyAdmin/ShippingPolicyAdmin";
import FAQAdmin from "./Pages/Dashboard/AdminDashboard/FAQAdmin/FAQAdmin";
import PixelAdmin from "./Pages/Dashboard/AdminDashboard/PixelAdmin/PixelAdmin";
import AdminPromoSection from "./Pages/Dashboard/AdminDashboard/PromoSection/AdminPromoSection";
import AdminPromoCardSection from "./Pages/Dashboard/AdminDashboard/AdminPromoCardSection/AdminPromoCardSection";
import AdminPopularCategory from "./Pages/Dashboard/AdminDashboard/AdminPopularCategory/AdminPopularCategory";
import AdminCategoryBanner from "./Pages/Dashboard/AdminDashboard/AdminCategoryBanner/AdminCategoryBanner";
import AdminProductCarousel from "./Pages/Dashboard/AdminDashboard/AdminProductCarousel/AdminProductCarousel";
import AdminHomeBrand from "./Pages/Dashboard/AdminDashboard/AdminBarnd/AdminBrand";
import AdminBannerManager from "./Pages/Dashboard/AdminDashboard/AdminBannerManager/AdminBannerManager";
import UserWhiteList from "./Pages/Dashboard/UserDashboard/UserWhiteList";
import AdminLogin from "./Auth/Login/AdminLogin";
import AdminProtectedRoute from "./Pages/Dashboard/DashboardHome/AdminPrivateRoute/AdminPrivateRoute";
import BkashCallback from "./Pages/HomePage/Home/TopSelling/Bkash/BkashCallback";
import PaymentSuccess from "./Pages/HomePage/Home/TopSelling/Bkash/PaymentSuccess";
import PaymentFailure from "./Pages/HomePage/Home/TopSelling/Bkash/PaymentFailure";
import PaymentCancel from "./Pages/HomePage/Home/TopSelling/Bkash/PaymentCancel";
import AdminNavbarCategory from "./Pages/Dashboard/AdminDashboard/AdminNabarCategory/AdminNabarCategory";
import HomeBannerAdvertis from "./Pages/Dashboard/AdminDashboard/HomeBannerAdvertis/HomeBannerAdvertis";
import AdminWithdraw from "./Pages/Dashboard/AdminDashboard/AdminWithdrawData/AdminWithdrawData";
import ForgotPassword from "./Auth/ForgotPassword/ForgotPassword";
import ReferralList from "./Pages/Dashboard/UserDashboard/UserOverView/ReferralList/ReferralList";
import AdminReferral from "./Pages/Dashboard/AdminDashboard/AdminRefferal/AdminRefferal";
import CampaignPage from "./Pages/Dashboard/AdminDashboard/CampaignPage/CampaignPage";
import AdminWinnerDataShow from "./Pages/Dashboard/AdminDashboard/AdminWinnerdataShow/AdminWinnerDataShow";
import Campaign from "./Pages/Campain/Campain";
import CampaignProducts from "./Pages/Campain/CampaignProducts";
import PurchaseInvoicePage from "./Pages/Dashboard/AdminDashboard/SuppliePurchase/PurchaseList/PurchaseInvoice";
import CategoryWiseDiscount from "./Pages/Dashboard/AdminDashboard/CategorywiseDiscount/CategorywiseDiscount";
import MessageSender from "./Pages/Dashboard/AdminDashboard/MessageSender/MessageSender";
import AdminBadgePanel from "./Pages/Dashboard/AdminDashboard/AdminBadgePanel/AdminBadgePanel";
import RefferalRegistration from "./Auth/Registration/RefferalRegistration/RefferalRegistration";
import BulkSMSSender from "./Pages/Dashboard/AdminDashboard/MessageSender/BulkSMSSender/BulkSMSSender";
import BulkEmailSender from "./Pages/Dashboard/AdminDashboard/MessageSender/BulkEmailSender/BulkEmailSender";
import TrackOrder from "./Pages/Dashboard/AdminDashboard/TrackOrder/TrackOrder";
import PromoCodeUpdate from "./Pages/Dashboard/AdminDashboard/PromoCode/PromoCode";
import ShowProduct from "./Pages/Dashboard/CategoryPage/AllUploadProduct/ShowProduct/ShowProduct";
import RoleManager from "./Pages/Dashboard/MakeAdmin/RoleAdd/RoleAdd";
import FraudCheck from "./Pages/Dashboard/AdminDashboard/FraudCheck/FraudCheck";
import ImageHashUpdate from "./Pages/HomePage/ImageHash/ImageHash";
import GoogleTagAdmin from "./Pages/Dashboard/AdminDashboard/GoogleTag/GoogleTag";
import Home from "./Pages/HomePage/Home/Home/Home.jsx";
import SellerPendingProduct from "./Pages/Dashboard/CategoryPage/AllUploadProduct/ShowProduct/SellerPendingProduct/SellerPendingProduct.jsx";
import AdminReturnManagement from "./Pages/Dashboard/AdminReturnManagement/AdminReturnManagement.jsx";
import AdminBannerLandingUpload from "./Pages/Dashboard/AdminDashboard/AdminBannerLanding/AdminBannerLanding.jsx";
import AdminPopularSection from "./Pages/Dashboard/AdminPopularSection/AdminPopularSection.jsx";
import SellerVerification from "./Pages/Dashboard/SellerVerification/SellerVerification.jsx";
import AdminSellerWithdraw from "./Pages/Dashboard/SellerWithdraw/SellerWithdraw.jsx";
import AdminSellerCommission from "./Pages/Dashboard/SellerWithdraw/Admin-Commsion.jsx";
import SellerProductsList from "./Pages/Dashboard/SellerPanneldata/SellerProductList.jsx";
import SellerProductsDetail from "./Pages/Dashboard/SellerPanneldata/SellerProductDetails.jsx";
import AdminSellerOrderList from "./Pages/Dashboard/SellerPanneldata/AdminSellerOrderList.jsx";
import AdminSellerOrderDetails from "./Pages/Dashboard/SellerPanneldata/AdminSellerOrderDetails.jsx";
import AdminReferralSystem from "./Pages/Dashboard/AdminRefferalsystem/AdminRefferalSystem.jsx";
// import PrivateRoute from "./Pages/Shared/PrivetRoute/PrivetRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <>
       <ErrorPage/>
      </>
    ),
    children: [
     
      
      {
    path: "/",
    element: <Home />,
  },

 

  
  
  
 
  
 
 
 
 
  
  {
    path: "/orderreview",
    element: <OrderReview/>,
  },
  {
    path: "/campain",
    element: <Campaign/>,
  },
  {
    path: "/campaigns/:campaignId",
    element: <CampaignProducts/>,
  },
 
  
  
  
  
  
 
 
  {
    path: "/customerreview",
    element: <CustomerReviews/>,
  },
 
  
 
  {
    path: "/payment",
    element: 
    // <PrivateRoute>
       <Payment />
    // </PrivateRoute>
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/newregister",
    element: <RefferalRegistration />,
  },
 
  {
    path: "/noti",
    element: <Noti />,
  },
  {
    path: "/forgetpassword",
    element: <ForgotPassword />,
  },
 
  {
    path: "/sendnoti",
    element: <SendNotification />,
  },
  
  {
    path: "/ff",
    element: <ProductForm />,
  },
  
  
 
     
     { path: "/dashbaord-admin-dailyshopping/login", element: <AdminLogin /> },
      {
            path: "/bkash/callback",
            element: <BkashCallback />,
          },
          {
            path: "/payment-success",
            element: <PaymentSuccess />,
          },
          {
            path: "/payment-failure",
            element: <PaymentFailure />,
          },
          {
            path: "/payment-cancel",
            element: <PaymentCancel />,
          },
     
   
    
     
      // {
      //   path:"bookDetails/:id",
      //   element: <ProductDetails />,
      // },
   
     
      
      // {
      //   path: "/category/:categoryName",
      //   element: <CategoryPage />,
      // },
     

        ],
      },



   

      {
        path: "/dashboard",
        element: (
           <PrivateRoute>
            <Dashboard />
           </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard",
            element: 
            // <AdminProtectedRoute>
              <DashboardHome />
            // </AdminProtectedRoute>
         
          },
          {
            path: "/dashboard/makeadmin",
            element: <MakeAdmin />,
          },
         
         
         
          {
            path: "/dashboard/myprofile",
            element: <MyProfile />,
          },
        
          {
            path: "/dashboard/useroverview",
            element: <UserOverView />,
          },
          {
            path: "/dashboard/activecoupon",
            element: <ActiveCoupon />,
          },
          {
            path: "/dashboard/totalcoupon",
            element: <TotalCoupons />,
          },
          {
            path: "/dashboard/totalwins",
            element: <TotalWins />,
          },
          {
            path: "/dashboard/wallet",
            element: <Wallet />,
          },
          {
            path: "/dashboard/trackorders",
            element: <TrackOrder />,
          },
          {
            path: "/dashboard/withdraw",
            element: <Withdraw />,
          },
          {
            path: "/dashboard/refferallist",
            element: <ReferralList />,
          },
         
        
        
          {
            path: "/dashboard/myorder",
            element: <MyOrders />,
          },
         
        
          {
            path: "/dashboard/userwhitelist",
            element: <UserWhiteList />,
          },
         
          {
            path: "/dashboard/invoice/:paymentId",
            element: <InvoicePage />,
          },
          
        
         
          
         
        
          

          // supplierpage 
          
         
    
    ],
  },

  {
  path: "/dashboard-admin-dailyshopping/dashboard",
  element: (
    <AdminProtectedRoute>
      <Dashboard />
    </AdminProtectedRoute>
  ),
  children: [
    {
      path: "/dashboard-admin-dailyshopping/dashboard",
      element: <DashboardHome />,
    },
     {
            path: "/dashboard-admin-dailyshopping/dashboard/addcategory",
            element: <AddCategory />,
          },
           {
            path: "/dashboard-admin-dailyshopping/dashboard/subcategory",
            element: <SubCategory />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/childcategory",
            element: <ChildCategory />,
          },

           {
            path: "/dashboard-admin-dailyshopping/dashboard/alluploadproduct",
            element: <AllUploadProduct />,
          },
           {
            path: "/dashboard-admin-dailyshopping/dashboard/imagehash",
            element: <ImageHashUpdate />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminbarnd",
            element: <AdminHomeBrand />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/sellerwithdraw-data",
            element: <AdminSellerWithdraw />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/admin-commsion",
            element: <AdminSellerCommission />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/sellerpendigproduct",
            element: <SellerPendingProduct />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminshowcategory",
            element: <AdminBannerManager />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminalldatawithdraw",
            element: <AdminWithdraw />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/sellervarificationRequest",
            element: <SellerVerification />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/uploadtopselling",
            element: <UploadTopSelling />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/refferalsystem",
            element: <AdminReferralSystem />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminproductcarousel",
            element: <AdminProductCarousel />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminrefferallist",
            element: <AdminReferral />,
          },
          {
    path: "/dashboard-admin-dailyshopping/dashboard/rolemanager",
    element: <RoleManager />,
  },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/footerdashboard",
            element: <FooterDashboard />,
          },
            {
            path: "/dashboard-admin-dailyshopping/dashboard/addbrand",
            element: <AddBrand />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/subadmin",
            element: <SubAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/useralldata",
            element: <UserAllData />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/aboutadmin",
            element: <AboutUsAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/homecategorynavbar",
            element: <AdminNavbarCategory />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/homebanneradvertis",
            element: <HomeBannerAdvertis />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/contactadmin",
            element: <ContactAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminbadge",
            element: <AdminBadgePanel />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/selllistproduct",
            element: <SellerProductsList />,
          },
          {
  path: "/dashboard-admin-dailyshopping/dashboard/sellerproducts/:sellerId",
  element: <SellerProductsDetail />,
},
          {
  path: "/dashboard-admin-dailyshopping/dashboard/adminsellerorderlist",
  element: <AdminSellerOrderList />,
},
          {
  path: "/dashboard-admin-dailyshopping/dashboard/sellerorders/:sellerId",
  element: <AdminSellerOrderDetails />,
},
          {
            path: "/dashboard-admin-dailyshopping/dashboard/categorydiscount",
            element: <CategoryWiseDiscount />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/bulksms",
            element: <BulkSMSSender />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/trackorder",
            element: <TrackOrder />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/bulkemail",
            element: <BulkEmailSender />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/pendingproduct",
            element: <PendingProduct />,
          },
         
          {
            path: "/dashboard-admin-dailyshopping/dashboard/updateorder",
            element: <UpdateOrder />,
          },
            {
            path: "/dashboard-admin-dailyshopping/dashboard/AllUserorder",
            element: <AllUserOrder />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/allproductshows",
            element: <AllProductShow />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/promocode",
            element: <PromoCodeUpdate />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminreturnmanage",
            element: <AdminReturnManagement />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/showallproduct",
            element: <ShowProduct />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/fraudcheck",
            element: <FraudCheck />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/sendnotifications",
            element: <AdminSendNotification />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/messagesender",
            element: <MessageSender />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/showproducts",
            element: <GetProduct />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/productupload",
            element: <ProductUpload />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/pixel",
            element: <PixelAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/googletag",
            element: <GoogleTagAdmin />,
          },
           {
            path: "/dashboard-admin-dailyshopping/dashboard/admintermcondition",
            element: <TermsConditionAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminshippingpolicys",
            element: <ShippingPolicyAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/faqadmin",
            element: <FAQAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/superadmin",
            element: <SuperAdmin />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/allcoupondata",
            element: <AllCouponDataShow />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/allrevenue",
            element: <AllRevenuedata />,
          },

            {
            path: "/dashboard-admin-dailyshopping/dashboard/manageexpense",
            element: <ManageExpenseCategory />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/expensemanager",
            element: <ExpenseManager />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/reportanalysis",
            element: <SalesReportAnalysis />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/topsellproductview",
            element: <AdminTopSellProductView />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/allstockmanagement",
            element: <AllStockManagement />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/lowstock",
            element: <LowStock />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/stockout",
            element: <StockOut />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminpromo",
            element: <AdminPromoSection />,
          },
           {
    path:"/dashboard-admin-dailyshopping/dashboard//purchase/:id",
    element: <PurchaseInvoicePage/>,
  },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminpromocard",
            element: <AdminPromoCardSection />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminbannerlanding",
            element: <AdminBannerLandingUpload />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminpopularsection",
            element: <AdminPopularSection />,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminpopularcategory",
            element: <AdminPopularCategory />,
          },
           {
            path: "/dashboard-admin-dailyshopping/dashboard/admincategorybanner",
            element: <AdminCategoryBanner />,
          },
           {
            path: "/dashboard-admin-dailyshopping/dashboard/getFooter",
            element: <GetFooter />,
          },
          // {
          //   path: "/dashboard/getnavber",
          //   element: <GetNavber />,
          // },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/bannerpost",
            element: <BannerPost />,
          },
        
          {
            path: "/dashboard-admin-dailyshopping/dashboard/editbanners/:id",
            element: <EditBanners/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/editnavber/:id",
            element: <EditNavber/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/editfooter/:id",
            element: <EditFooter/>,
          },

          {
            path: "/dashboard-admin-dailyshopping/dashboard/editproductdatas/:id",
            element: <EditProduct/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/addsupplier",
            element: <SupplierPage/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/campain",
            element: <CampaignPage/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/adminwinnerdata",
            element: <AdminWinnerDataShow/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/supplier",
            element: <SupplierList/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/purchaseentry",
            element: <PurchaseEntry/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/purchaselist",
            element: <PurchaseList/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/supplier/edit/:id",
            element: <SupplierEdit/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/supplier/payment/:id",
            element: <SupplierPayment/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/supplier/invoice/:id",
            element: <SupplierInvoice/>,
          },
          {
            path: "/dashboard-admin-dailyshopping/dashboard/invoice/:paymentId",
            element: <InvoicePage />,
          },
  ],
},
]);
export default router;
