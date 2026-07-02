import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

const emptyForm = {
  title: "",
  author: "",
  genre: "",
  year: "",
  stock: 0,
  description: "",
  cover: "",
};

function getInitialForm(initialBook) {
  if (!initialBook) {
    return emptyForm;
  }

  return {
    title: initialBook.title,
    author: initialBook.author,
    genre: initialBook.genre,
    year: initialBook.year,
    stock: initialBook.stock,
    description: initialBook.description,
    cover: initialBook.cover,
  };
}

export default function BookFormDialog({
  visible,
  onHide,
  onSave,
  initialBook,
}) {
  const toast = useRef(null);

  const [form, setForm] = useState(() => getInitialForm(initialBook));

  const isEditing = Boolean(initialBook);

  function updateField(field, value) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  function showValidationMessage(message) {
    toast.current.show({
      severity: "warn",
      summary: "Validación",
      detail: message,
      life: 3000,
    });
  }

  function validateForm() {
    if (!form.title.trim()) {
      return "El título es obligatorio.";
    }

    if (!form.author.trim()) {
      return "El autor es obligatorio.";
    }

    if (!form.genre.trim()) {
      return "El género es obligatorio.";
    }

    if (!form.year || Number(form.year) <= 0) {
      return "El año debe ser válido.";
    }

    if (Number(form.stock) < 0) {
      return "El stock no puede ser negativo.";
    }

    if (!form.cover.trim()) {
      return "La URL de imagen es obligatoria.";
    }

    if (!form.description.trim()) {
      return "La descripción es obligatoria.";
    }

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showValidationMessage(validationError);
      return;
    }

    onSave(form);
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        className="px-2! py-1.5!"
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        text
        outlined
        onClick={onHide}
      />

      <Button
        className="px-2! py-1.5!"
        label={isEditing ? "Guardar cambios" : "Agregar libro"}
        icon="pi pi-check"
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        header={isEditing ? "Editar libro" : "Agregar libro"}
        visible={visible}
        style={{ width: "42rem" }}
        modal
        footer={footer}
        onHide={onHide}
      >
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Título
              </label>

              <InputText
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full"
                placeholder="Ej: El principito"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Autor
              </label>

              <InputText
                value={form.author}
                onChange={(event) => updateField("author", event.target.value)}
                className="w-full"
                placeholder="Ej: Antoine de Saint-Exupéry"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Género
              </label>

              <InputText
                value={form.genre}
                onChange={(event) => updateField("genre", event.target.value)}
                className="w-full"
                placeholder="Ficción"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Año
              </label>

              <InputNumber
                value={Number(form.year) || null}
                onValueChange={(event) => updateField("year", event.value)}
                useGrouping={false}
                className="w-full"
                inputClassName="w-full"
                placeholder="1943"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Stock
              </label>

              <InputNumber
                value={Number(form.stock)}
                onValueChange={(event) =>
                  updateField("stock", event.value ?? 0)
                }
                min={0}
                useGrouping={false}
                className="w-full"
                inputClassName="w-full"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              URL de imagen
            </label>

            <InputText
              value={form.cover}
              onChange={(event) => updateField("cover", event.target.value)}
              className="w-full"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>

            <InputTextarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              className="w-full"
              placeholder="Breve descripción del libro..."
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
