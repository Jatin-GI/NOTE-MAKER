import React from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <div className="md:w-64">{/* <SideBar /> */}</div>
      <Header />
      <div className="">
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
