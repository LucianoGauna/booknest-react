import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import LoanStatusTag from "../components/LoanStatusTag";
import PageHeader from "../components/PageHeader";
import { users } from "../data/users";
import { useLibrary } from "../context/useLibrary";

export default function AdminPrestamos() {
  const { books, loans, updateLoanStatus } = useLibrary();

  const loansWithDetails = loans.map((loan) => {
    const book = books.find((item) => item.id === loan.bookId);
    const user = users.find((item) => item.id === loan.userId);

    return {
      ...loan,
      bookTitle: book?.title || "Libro eliminado",
      bookAuthor: book?.author || "-",
      userName: user?.name || "Usuario eliminado",
      userEmail: user?.email || "-",
    };
  });

  function userBodyTemplate(rowData) {
    return (
      <div>
        <p className="font-semibold text-slate-900">{rowData.userName}</p>
        <p className="text-sm text-slate-500">{rowData.userEmail}</p>
      </div>
    );
  }

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
    const isPending = rowData.status === "Pendiente";
    const isApproved = rowData.status === "Aprobado";

    return (
      <div className="flex gap-2">
        <Button
        className="px-2! py-1!"
          label="Aprobar"
          icon="pi pi-check"
          severity="success"
          outlined
          size="small"
          disabled={!isPending}
          onClick={() => updateLoanStatus(rowData.id, "Aprobado")}
        />

        <Button
        className="px-2! py-1!"
          label="Rechazar"
          icon="pi pi-times"
          severity="danger"
          outlined
          size="small"
          disabled={!isPending}
          onClick={() => updateLoanStatus(rowData.id, "Rechazado")}
        />

        <Button
        className="px-2! py-1!"
          label="Devuelto"
          icon="pi pi-refresh"
          severity="info"
          outlined
          size="small"
          disabled={!isApproved}
          onClick={() => updateLoanStatus(rowData.id, "Devuelto")}
        />
      </div>
    );
  }

  return (
    <section>
      <PageHeader
        title="Administración de préstamos"
        description="Revisá las solicitudes de los usuarios y actualizá el estado de cada préstamo."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <DataTable
          value={loansWithDetails}
          paginator
          rows={5}
          emptyMessage="No hay préstamos registrados."
          stripedRows
          tableStyle={{ minWidth: "64rem" }}
        >
          <Column
            header="Usuario"
            body={userBodyTemplate}
            style={{ minWidth: "14rem" }}
          />

          <Column
            header="Libro"
            body={bookBodyTemplate}
            style={{ minWidth: "16rem" }}
          />

          <Column
            field="requestDate"
            header="Solicitud"
            style={{ minWidth: "9rem" }}
          />

          <Column
            field="returnDate"
            header="Devolución"
            style={{ minWidth: "9rem" }}
          />

          <Column
            header="Estado"
            body={statusBodyTemplate}
            style={{ minWidth: "9rem" }}
          />

          <Column
            header="Acciones"
            body={actionsBodyTemplate}
            style={{ minWidth: "22rem" }}
          />
        </DataTable>
      </div>
    </section>
  );
}