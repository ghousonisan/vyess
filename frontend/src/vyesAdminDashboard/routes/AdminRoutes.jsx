import { Routes, Route, Navigate } from 'react-router-dom';

// 1. Import your Layout
import Login from '../pages/Login';
import AdminLayout from '../layouts/AdminDashboardLayout';
import Dashboard from '../pages/Dashboard';
import QuoteRequested from '../pages/QuoteRequested';
import ReviewQuoteRequest from '../pages/ReviewQuoteRequest';
import AssignVendor from '../pages/AssignVendor';
import BecomePartner from '../pages/BecomePartner';
import VendorDetailsOutlet from '../pages/VendorDetailsOutlet';
import ProtectedRoute from '../components/ProtectedRoute';
import {MaintenancePage} from '../pages/MaintenancePage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route element={<AdminLayout />}>
        {/* <Route index element={<Dashboard />} /> */}
        {/* <Route path="quoteRequested" element={<QuoteRequested />} /> */}
        {/* <Route path="reviewQuote" element={<ReviewQuoteRequest />} /> */}
        {/* <Route path="assignVendor" element={<AssignVendor />} /> */}
        <Route path="becomePartner" element={<ProtectedRoute><BecomePartner /></ProtectedRoute>} />
        <Route path="/vendorDetails/:id" element={<ProtectedRoute><VendorDetailsOutlet /></ProtectedRoute>} />
        {/* <Route path="services" element={<Services />} /> */}
        {/* <Route path="services/:serviceId" element={<div>Service Detail Page</div>} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        {/* <Route path="partnerLogin" element={<PartnerLogin />} /> */}
        {/* <Route path="signup" element={<Signup />} /> */}
        {/* <Route path="subCategory" element={<Services />} /> */}
        {/* <Route path="subCategory/:subCategoryId" element={<Service />} /> */}
        <Route path="*" element={<MaintenancePage />} />
      </Route>


      <Route path="*" element={<MaintenancePage />} />
    </Routes>
  )
}

export default AdminRoutes