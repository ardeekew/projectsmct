import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Registration from '../components/Registration';
import ForgotPassword from '../components/ForgotPassword';
import Request from '../components/Request';
import CreateStockRequistion from '../components/CreateStockRequistion';
import CreatePurchaseOrder from '../components/CreatePurchaseOrder';
import CreateCashDisbursement from '../components/CreateCashDisbursement';
import CreateApplicationCash from '../components/CreateApplicationCash';
import CreateLiquidation from '../components/CreateLiquidation';
import ApproverDashBoard from '../components/ApproverDashBoard';
import ApproverViewRequest from '../components/ApproverViewRequest';
import Profile from '../components/Profile';
import UpdateInformation from '../components/UpdateInformation';
import CreateRefund from '../components/CreateRefund';
import SetupUser from '../components/SetupUser';
import SetupBranch from '../components/SetupBranch';



interface RouterProps {
  isdarkMode: boolean;
}

const Router: React.FC<RouterProps> = ({isdarkMode}) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
         
          <Route path='/dashboard' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path='/request' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<Request />} />
          </Route>
          <Route path='request/sr' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateStockRequistion />} />
          </Route>
          <Route path='request/pors' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreatePurchaseOrder />} />
          </Route>
          <Route path='request/cdrs' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateCashDisbursement />} />
          </Route>
          <Route path='request/afca' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateApplicationCash />} />
          </Route>
          <Route path='request/loae' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateLiquidation />} />
          </Route>
          <Route path='request/rfr' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateRefund />} />
          </Route>
          <Route path='/dashboardapprover' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<ApproverDashBoard />} />
          </Route>
          <Route path='/requestapprover' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<ApproverViewRequest />} />
          </Route>
          <Route path='/profile' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path='/Update_Profile' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<UpdateInformation />} />
          </Route>
          <Route path='/setup/User' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<SetupUser />} />
          </Route>
          <Route path='/setup/Branch' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<SetupBranch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
