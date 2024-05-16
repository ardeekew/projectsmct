import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Registration from '../components/Registration';
import ForgotPassword from '../components/ForgotPassword';
import Request from '../components/Request';
import CreateStockRequistion from '../components/CreateStockRequistion';
interface RouterProps {
  isdarkMode: boolean;
}

const Router: React.FC<RouterProps> = ({isdarkMode}) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
         
          <Route path='/dashboard' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path='/request' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<Request />} />
          </Route>
          <Route path='/sr' element={<App isdarkMode={isdarkMode} />}>
            <Route index element={<CreateStockRequistion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
