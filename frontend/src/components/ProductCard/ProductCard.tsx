import "./ProductCard.css";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{name}</h3>

      <p className="price">
        R$ {price.toFixed(2)}
      </p>

      <button
        onClick={() => onAddToCart?.(id)}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}