import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import InvitationPage from "./pages/InvitationPage";
import NotFoundPage from "./pages/NotFoundPage";
import PopupPage from "./pages/PopupPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/wedding/" element={<InvitationPage />} />
      </Route>
      <Route path="/popup" element={<PopupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
