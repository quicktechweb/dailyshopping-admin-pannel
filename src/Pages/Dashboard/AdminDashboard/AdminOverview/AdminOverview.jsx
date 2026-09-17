import AllRevenuedata from "../../AdminAllRevenue/AllRevenuedata/AllRevenuedata";
import SalesReportCharts from "../../SalesReportAnalysis/SalesReportAnalysis";

const AdminOverview = () => {
    return (
        <div>
            <AllRevenuedata/>
            <div className="">
                <SalesReportCharts/>
            </div>
            
        </div>
    );
};

export default AdminOverview;