import "./ProductCard.css";
import { useRef } from "react";

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isAdmin?: boolean;
  onAddToCart?: (id: string) => void;
  onEdit?: (id: string) => void;
  onImageChange?: (id: string, file: File) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  isAdmin = false,
  onAddToCart,
  onEdit,
  onImageChange,
}: ProductCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageClick() {
    if (isAdmin) {
      fileInputRef.current?.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(id, file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div className="product-card">
      {/* Image Banner */}
      <div
        className={`product-image-banner ${isAdmin ? "product-image-banner--admin" : ""}`}
        onClick={handleImageClick}
        title={isAdmin ? "Clique para alterar a imagem" : undefined}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            {isAdmin ? (
              <>
                <span className="product-image-placeholder__icon">📷</span>
                <span className="product-image-placeholder__text">
                  Adicionar imagem
                </span>
              </>
            ) : (
              <span className="product-image-placeholder__icon">🛍️</span>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="product-image-overlay">
            <span className="product-image-overlay__icon">📷</span>
            <span className="product-image-overlay__text">Alterar imagem</span>
          </div>
        )}

        {/* Hidden file input */}
        {isAdmin && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        )}
      </div>

      {/* Card Content */}
      <div className="product-card__body">
        <h3>{name}</h3>
        <p className="price">R$ {price.toFixed(2)}</p>

        <div className="product-card__actions">
          {isAdmin ? (
            <button
              className="btn-secondary product-edit-btn"
              onClick={() => onEdit?.(id)}
              title="Editar produto"
            >
              ✏️ Editar
            </button>
          ) : (
            <button onClick={() => onAddToCart?.(id)}>
              Adicionar ao carrinho
            </button>
          )}
        </div>
      </div>
    </div>
  );
}