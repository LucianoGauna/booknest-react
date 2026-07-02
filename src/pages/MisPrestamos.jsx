import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import LoanStatusTag from "../components/LoanStatusTag";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/useAuth";
import { useLibrary } from "../context/useLibrary";

export default function MisPrestamos() {
  const { user } = useAuth();
  const { books, loans, cancelLoan } = useLibrary();

  const myLoans = loans
    .filter((loan) => loan.userId === user.id)
    .map((loan) => {
      const book = books.find((item) => item.id === loan.bookId);

      return {
        ...loan,
        bookTitle: book?.title || "Libro eliminado",
        bookAuthor: book?.author || "-",
      };
    });

  function bookBodyTemplate(rowData) {
    return (
      <div>
        <p className="font-semibold text-slate-900">{rowData.bookTitle}</p>
        <p className="text-sm text-slate-500">{rowData.bookAuthor}</p>
      </div>
    );
  }

  function statusBodyTemplate(rowData) {
    return <LoanStatusTag status={rowData.status} />;
  }

  function actionsBodyTemplate(rowData) {
    const canCancel = rowData.status === "Pendiente";

    return (
      <Button
        label="Cancelar"
        icon="pi pi-times"
        severity="danger"
        outlined
        className="px-2! py-1!"
        disabled={!canCancel}
        onClick={() => cancelLoan(rowData.id)}
      />
    );
  }

  return (
    <section>
      <PageHeader
        title="Mis préstamos"
        description="Consultá el estado de tus solicitudes y cancelá aquellas que todavía estén pendientes."
        action={
          <Link
            to="/catalogo"
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Ver catálogo
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable
          value={myLoans}
          paginator
          rows={5}
          emptyMessage="Todavía no tenés préstamos registrados."
          stripedRows
          tableStyle={{ minWidth: "48rem" }}
        >
          <Column
            header="Libro"
            body={bookBodyTemplate}
            style={{ minWidth: "16rem" }}
          />

          <Column
            field="requestDate"
            header="Fecha de solicitud"
            style={{ minWidth: "10rem" }}
          />

          <Column
            field="returnDate"
            header="Fecha de devolución"
            style={{ minWidth: "10rem" }}
          />

          <Column
            header="Estado"
            body={statusBodyTemplate}
            style={{ minWidth: "9rem" }}
          />

          <Column
            header="Acciones"
            body={actionsBodyTemplate}
            style={{ minWidth: "9rem" }}
          />
        </DataTable>
      </div>
    </section>
  );
}
