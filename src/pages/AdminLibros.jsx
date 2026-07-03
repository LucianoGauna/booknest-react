import { useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import BookFormDialog from "../components/BookFormDialog";
import PageHeader from "../components/PageHeader";
import { useLibrary } from "../context/useLibrary";

export default function AdminLibros() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();

  const toast = useRef(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  function openCreateDialog() {
    setSelectedBook(null);
    setDialogVisible(true);
  }

  function openEditDialog(book) {
    setSelectedBook(book);
    setDialogVisible(true);
  }

  function closeDialog() {
    setDialogVisible(false);
    setSelectedBook(null);
  }

  function handleSave(bookData) {
    if (selectedBook) {
      updateBook(selectedBook.id, bookData);
    } else {
      addBook(bookData);
    }

    closeDialog();
  }

  function handleDelete(book) {
    confirmDialog({
      message: `¿Seguro que querés eliminar "${book.title}"? Esta acción no se puede deshacer.`,
      header: "Eliminar libro",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger py-1.5! px-2!",
      rejectClassName: "p-button-secondary p-button-outlined py-1.5! px-2!",
      accept: () => {
        deleteBook(book.id);

        toast.current.show({
          severity: "success",
          summary: "Libro eliminado",
          detail: `"${book.title}" fue eliminado correctamente.`,
          life: 3000,
        });
      },
    });
  }

  function coverBodyTemplate(rowData) {
    return (
      <img
        src={rowData.cover}
        alt={rowData.title}
        className="h-16 w-12 rounded-lg object-cover"
      />
    );
  }

  function titleBodyTemplate(rowData) {
    return (
      <div>
        <p className="font-semibold text-slate-900">{rowData.title}</p>
        <p className="text-sm text-slate-500">{rowData.author}</p>
      </div>
    );
  }

  function stockBodyTemplate(rowData) {
    const hasStock = rowData.stock > 0;

    return (
      <Tag
        value={hasStock ? `Stock: ${rowData.stock}` : "Sin stock"}
        severity={hasStock ? "success" : "danger"}
      />
    );
  }

  function actionsBodyTemplate(rowData) {
    return (
      <div className="flex gap-2">
        <Button
          className="px-2! py-1!"
          label="Editar"
          icon="pi pi-pencil"
          severity="info"
          outlined
          size="small"
          onClick={() => openEditDialog(rowData)}
        />

        <Button
          className="px-2! py-1!"
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          outlined
          size="small"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <section>
        <PageHeader
          title="Gestión de libros"
          description="Administrá el catálogo disponible para los usuarios de BookNest."
          action={
            <Button
              className="px-2.5! py-1!"
              label="Agregar libro"
              icon="pi pi-plus"
              onClick={openCreateDialog}
            />
          }
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <DataTable
            dataKey="id"
            value={books}
            paginator
            rows={5}
            emptyMessage="No hay libros cargados."
            stripedRows
            tableStyle={{ minWidth: "64rem" }}
          >
            <Column
              header="Portada"
              body={coverBodyTemplate}
              style={{ width: "7rem" }}
            />

            <Column
              header="Libro"
              body={titleBodyTemplate}
              style={{ minWidth: "16rem" }}
            />

            <Column
              field="genre"
              header="Género"
              style={{ minWidth: "10rem" }}
            />

            <Column field="year" header="Año" style={{ minWidth: "7rem" }} />

            <Column
              header="Stock"
              body={stockBodyTemplate}
              style={{ minWidth: "9rem" }}
            />

            <Column
              header="Acciones"
              body={actionsBodyTemplate}
              style={{ minWidth: "14rem" }}
            />
          </DataTable>
        </div>

        {dialogVisible && (
          <BookFormDialog
            key={selectedBook?.id ?? "new-book"}
            visible={dialogVisible}
            initialBook={selectedBook}
            onHide={closeDialog}
            onSave={handleSave}
          />
        )}
      </section>
    </>
  );
}
