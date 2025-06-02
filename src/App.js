import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import ConnectSSH from "./components/ConnectSSH";
import HomeAdmin from "./components/HomeAdmin";
import HomeUser from "./components/HomeUser";
import AddServer from "./components/AddServer";


// THANH NHUT Component
import TeamList from './components/Nhut-components/Team/Teams';
import DashboarApplication from './components/Nhut-components/Application/DashboarApplication';
import UserService from './components/Nhut-components/UserComponent/UserService';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
            <Route path="/connect" element={<ConnectSSH />} />
            <Route path="/user" element={<HomeUser />} />
            {/*<Route path="/admin" element={<HomeAdmin />} />*/}
            {/* Layout admin */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<HomeAdmin />} />
                <Route path="/addserver" element={<AddServer />} />

                {/* START - THANH NHUT COMPONENT */}
                <Route path="/nhom" element={<TeamList />} />
                <Route path="/application" element={<DashboarApplication />} />

                {/* END -   THANH NHUT COMPONENT */}

            </Route>

            {/* Layout người dùng */}
            <Route element={<UserLayout />}>
                <Route path="/userService" element={<UserService />} />

            {/*    <Route path="/" element={<HomeUser />} />*/}
            {/*    /!* có thể thêm các trang user khác ở đây *!/*/}
            </Route>
        </Routes>

      </Router>
  );
}

export default App;
