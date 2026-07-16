import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Layout from "../components/layout/Layout";
import Products from "../pages/Products/Products";
import Cart from "../pages/Cart/Cart";
import SelectStore from "../pages/SelectStore/SelectStore";
import MyOrders from "../pages/MyOrders/MyOrders";
import StoreOrders from "../pages/StoreOrders/StoreOrders";

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
          path="/select-store"
          element={<SelectStore />}
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

        <Route
            path="/cart"
            element={<Cart />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        <Route
        path="/store-orders"
        element={<StoreOrders />}
      />

      </Routes>
    </BrowserRouter>
  );
}