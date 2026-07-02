import { Tag } from "primereact/tag";

function getStatusSeverity(status) {
  if (status === "Pendiente") {
    return "warning";
  }

  if (status === "Aprobado") {
    return "success";
  }

  if (status === "Rechazado") {
    return "danger";
  }

  if (status === "Devuelto") {
    return "info";
  }

  return "secondary";
}

export default function LoanStatusTag({ status }) {
  return <Tag value={status} severity={getStatusSeverity(status)} />;
}