import { useEffect, useState } from "react";
import BackButton from "../../components/BackButton/BackButton";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../../services/dashboard.service";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setMetrics(await getDashboardMetrics());
      } catch {
        setError(true);
      }
    }

    loadMetrics();
  }, []);

  if (error) {
    return (
      <>
        <BackButton />
        <div className="empty-state">
          <h2>Não foi possível carregar o dashboard</h2>
          <p>Tente novamente em alguns instantes.</p>
        </div>
      </>
    );
  }

  if (!metrics) {
    return <p className="dashboard-loading">Carregando indicadores...</p>;
  }

  const cards = [
    { label: "Produtos cadastrados", value: metrics.products },
    { label: "Clientes da loja", value: metrics.customers },
    { label: "Pedidos recebidos", value: metrics.orders },
    { label: "Pedidos pendentes", value: metrics.pendingOrders },
    { label: "Pedidos entregues", value: metrics.deliveredOrders },
    { label: "Faturamento", value: formatCurrency(metrics.revenue), featured: true },
  ];

  return (
    <>
      <BackButton />
      <section className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">Visão administrativa</p>
          <h1>Dashboard da {metrics.store.name}</h1>
          <p>Acompanhe os indicadores da sua loja.</p>
        </div>
        {metrics.store.logoUrl && (
          <img
            className="dashboard-store-logo"
            src={metrics.store.logoUrl}
            alt={`Logo da ${metrics.store.name}`}
          />
        )}
      </section>

      <section className="dashboard-grid" aria-label="Indicadores da loja">
        {cards.map((card) => (
          <article
            className={`dashboard-metric ${card.featured ? "dashboard-metric--featured" : ""}`}
            key={card.label}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>
    </>
  );
}
