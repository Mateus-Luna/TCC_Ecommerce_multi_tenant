export function translateOrderStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "Pendente";

    case "PAID":
      return "Pago";

    case "SHIPPED":
      return "Enviado";

    case "DELIVERED":
      return "Entregue";

    default:
      return status;
  }
}