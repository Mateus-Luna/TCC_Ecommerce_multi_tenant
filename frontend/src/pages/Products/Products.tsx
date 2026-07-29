import { useEffect, useRef, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  type Product,
  deleteProduct,
} from "../../services/products.service";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../contexts/cart.context";
import BackButton from "../../components/BackButton/BackButton";
import { useStore } from "../../contexts/store.context";
import { useAuth } from "../../hooks/useAuth";
import { updateStoreBanner } from "../../services/stores.service";
// ─── Edit Modal ──────────────────────────────────────────────────────────────

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSaved: (updated: Product) => void;
}

function EditModal({ product, onClose, onSaved }: EditModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceNum = parseFloat(price);
    if (!name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("O preço deve ser um número positivo maior que zero.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProduct(product.id, {
        name: name.trim(),
        price: priceNum,
      });
      onSaved(updated);
    } catch {
      setError("Erro ao salvar produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Editar Produto</h3>
          <button
            type="button"
            className="modal-close-btn btn-secondary"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <p style={{ color: "var(--error)", margin: "0 0 0.5rem" }}>
              {error}
            </p>
          )}

          <div className="form-group">
            <label>Nome do Produto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Camiseta Azul"
              required
            />
          </div>

          <div className="form-group">
            <label>Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 49.90"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { items } = useCart();
  const { store } = useStore();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  console.log("USER:", user);
  console.log("IS ADMIN:", isAdmin);
  console.log("STORE:", store);

  // Add product form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [addError, setAddError] = useState("");

  // Edit modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Image upload state
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  async function handleBannerChange(
      e: React.ChangeEvent<HTMLInputElement>
    ) {
      const file = e.target.files?.[0];

      if (!file || !store) return;

      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;

          await updateStoreBanner(
            store.id,
            dataUrl
          );

          window.location.reload();
        } catch {
          alert("Erro ao atualizar banner.");
        }
      };

      reader.readAsDataURL(file);

      e.target.value = "";
    }

    // ── Add Product ──────────────────────────────────────────────────────────
  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");

    if (!newProductName.trim()) {
      setAddError("O nome do produto é obrigatório.");
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setAddError("O preço deve ser um número positivo maior que zero.");
      return;
    }

    try {
      const newProd = await createProduct({
        name: newProductName,
        price: priceNum,
      });
      setProducts((prev) => [newProd, ...prev]);
      setNewProductName("");
      setNewProductPrice("");
      setShowAddForm(false);
    } catch {
      setAddError("Erro ao cadastrar produto. Tente novamente.");
    }
  }

  // ── Edit Product (save from modal) ────────────────────────────────────────
  function handleProductSaved(updated: Product) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updated.id ? { ...p, ...updated } : p
      )
    );
    setEditingProduct(null);
  }

  async function handleDeleteProduct(id: string) {
  const confirmed = window.confirm(
    "Tem certeza que deseja excluir este produto?"
  );

  if (!confirmed) return;

  try {
    await deleteProduct(id);

    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  } catch (error) {
    alert(
      "Não foi possível excluir o produto. Ele pode estar associado a pedidos."
    );
  }
}

    

  // ── Image Upload ─────────────────────────────────────────────────────────
  async function handleImageChange(productId: string, file: File) {
    setUploadingId(productId);
    try {
      // Convert image to base64 data URL for local preview (no storage server)
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const updated = await updateProduct(productId, { imageUrl: dataUrl });
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, imageUrl: updated.imageUrl } : p))
        );
        setUploadingId(null);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingId(null);
    }
  }

  return (
    <>
      <BackButton />

      {isAdmin && store && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <button onClick={() => bannerInputRef.current?.click()}>
            🖼️ {store.bannerUrl ? "Alterar banner" : "Adicionar banner"}
          </button>
          {store.bannerUrl && (
            <button
              className="btn-secondary"
              onClick={async () => {
                try {
                  await updateStoreBanner(store.id, null);
                  window.location.reload();
                } catch {
                  alert("Erro ao remover banner.");
                }
              }}
            >
              🗑️ Remover banner
            </button>
          )}
        </div>
      )}


      {/* Store Banner */}
      {store?.bannerUrl && (
        <img
          src={store.bannerUrl}
          style={{
            width: "100%",
            maxHeight: 260,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 20,
          }}
          alt="Banner da Loja"
        />
      )}

      {/* Store Info */}
      {store && (
        <div
          className="card"
          style={{
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h2>Bem-vindo à {store.name}</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            {store.description}
          </p>
          {store.phone && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              📞 {store.phone}
            </p>
          )}
          {store.address && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              📍 {store.address}
            </p>
          )}
        </div>
      )}

      {/* Admin – Add Product */}
      {isAdmin && (
        <div style={{ marginBottom: "2rem" }}>
          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)}>
              + Adicionar Produto
            </button>
          ) : (
            <form
              onSubmit={handleCreateProduct}
              className="card"
              style={{
                maxWidth: "500px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <h3>Novo Produto</h3>
              {addError && (
                <p style={{ color: "var(--error)", margin: 0 }}>{addError}</p>
              )}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Nome do Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Camiseta Azul"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Ex: 49.90"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit">Cadastrar</button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setAddError("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <h1>Produtos</h1>

      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="grid-container">
          {products.map((product) => (
            <div key={product.id} style={{ position: "relative" }}>
              {uploadingId === product.id && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    background: "rgba(255,255,255,0.75)",
                    borderRadius: "var(--border-radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    color: "var(--primary)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  Enviando imagem…
                </div>
              )}
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                isAdmin={isAdmin}
                onAddToCart={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                  })
                }
                onEdit={(id) => {
                  const p = products.find((pr) => pr.id === id);
                  if (p) setEditingProduct(p);
                }}
                onImageChange={handleImageChange}
                onDelete={handleDeleteProduct}
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={handleProductSaved}
        />
      )}

      {/* Hidden file inputs */}
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.currentTarget.files?.[0];
          if (file && store) {
            try {
              const reader = new FileReader();
              reader.onload = async (ev) => {
                const dataUrl = ev.target?.result as string;
                await updateStoreBanner(store.id, dataUrl);
                window.location.reload();
              };
              reader.readAsDataURL(file);
            } catch {
              alert("Erro ao fazer upload do banner.");
            }
          }
        }}
      />
    </>
  );
}