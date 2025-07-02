import { Routes, Route } from "react-router-dom";
import RocketList from "../pages/RocketList";
import RocketDetail from "../pages/RocketDetail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RocketList />} />
    <Route path="/rocket/:id" element={<RocketDetail />} />
  </Routes>
);

export default AppRoutes;
