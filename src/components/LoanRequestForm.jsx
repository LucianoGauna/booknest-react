import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function formatDateToInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function LoanRequestForm({ book, onSubmit }) {
  const toast = useRef(null);

  const [returnDate, setReturnDate] = useState(null);

  const today = getToday();
  const hasStock = book.stock > 0;

  function showValidationMessage(message) {
    toast.current.show({
      severity: "warn",
      summary: "Validación",
      detail: message,
      life: 3000,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!returnDate) {
      showValidationMessage("Seleccioná una fecha estimada de devolución.");
      return;
    }

    if (returnDate < today) {
      showValidationMessage(
        "La fecha de devolución no puede ser anterior a hoy.",
      );
      return;
    }

    const formattedReturnDate = formatDateToInputValue(returnDate);
    const result = onSubmit(formattedReturnDate);

    if (!result.success) {
      showValidationMessage(result.message);
    }
  }

  return (
    <>
      <Toast ref={toast} />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-slate-900">
          Solicitar préstamo
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Elegí una fecha estimada para devolver el libro. La solicitud quedará
          pendiente hasta que un administrador la apruebe.
        </p>

        <div className="my-5">
          <label
            htmlFor="returnDate"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Fecha estimada de devolución
          </label>

          <Calendar
            id="returnDate"
            value={returnDate}
            onChange={(event) => setReturnDate(event.value)}
            minDate={today}
            disabled={!hasStock}
            dateFormat="dd/mm/yy"
            readOnlyInput
            showIcon
            placeholder="Seleccioná una fecha"
            className="w-full"
            inputClassName="w-full"
          />
        </div>

        {!hasStock && (
          <Message
            severity="warn"
            text="Este libro no tiene stock disponible en este momento."
            className="mb-4 w-full justify-start"
          />
        )}

        <Button
          type="submit"
          label="Solicitar préstamo"
          icon="pi pi-send"
          disabled={!hasStock}
          className={`${!hasStock ? "mt-5!" : ""} w-full`}
        />
      </form>
    </>
  );
}