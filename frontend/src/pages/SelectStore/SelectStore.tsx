import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStores, type Store } from "../../services/stores.service";
import { useTenant } from "../../hooks/useTenant";
import BackButton from "../../components/BackButton/BackButton";

export default function SelectStore() {
  const [stores, setStores] = useState<Store[]>([]);

  const navigate = useNavigate();

  const { setTenantId } = useTenant();

  useEffect(() => {
    async function loadStores() {
      const data = await getStores();

      setStores(data);
    }

    loadStores();
  }, []);

  function handleSelect(store: Store) {
    setTenantId(store.id);

    navigate("/products");
  }

  return (
    <div className="store-selection-container">
      <BackButton />
      <h1>Escolha uma loja</h1>

      <div className="store-grid">
        {stores.map((store) => (
          <div
            key={store.id}
            className="store-card"
          >
            <h3>{store.name}</h3>

            <p>{store.domain}</p>

            <button
              onClick={() => handleSelect(store)}
            >
              Entrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}