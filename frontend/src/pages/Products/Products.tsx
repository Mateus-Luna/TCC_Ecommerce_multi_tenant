import { useEffect, useState } from "react";
import {  getProducts, type Product } from "../../services/products.service";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../contexts/cart.context";
import BackButton from "../../components/BackButton/BackButton";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { items } = useCart();
  console.log(items);

  useEffect(() => {
    async function fetchProducts() {
      const products = await getProducts();
      console.log(products);
      setProducts(products);
    }

    fetchProducts();
  }, []);
  console.log(localStorage.getItem("token"));

    return (
  <>
  <BackButton />
    <h1>Produtos</h1>

    {products.length === 0 ? (
      <p>Nenhum produto encontrado.</p>
    ) : (
      <div className="grid-container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            onAddToCart={() =>
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                })
            }
          />
        ))}
      </div>
    )}
  </>
);

}