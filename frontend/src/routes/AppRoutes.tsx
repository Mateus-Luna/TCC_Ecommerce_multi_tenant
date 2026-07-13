import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Layout from "../components/layout/Layout";
import Products from "../pages/Products/Products";

function StoreSelection() {
  return <h1>Selecionar Loja</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/stores"
          element={<StoreSelection />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

        <Route
            path="/products"
            element={
                <Layout>
                    <Products />
                </Layout>

            }

/>
      </Routes>
    </BrowserRouter>
  );
}