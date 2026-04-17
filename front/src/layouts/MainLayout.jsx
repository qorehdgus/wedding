import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <main className="page">
      <div className="shell">
        <Outlet />
      </div>
    </main>
  );
}

export default MainLayout;
