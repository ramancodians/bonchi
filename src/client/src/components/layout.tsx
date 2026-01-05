import SidePanel from "./sidepanel";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="flex">
        <div>
          <SidePanel />
        </div>
        <main className="bg-base-200 w-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
