import { createContext, useContext } from "react";

export const LibraryContext = createContext(null);

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error("useLibrary debe usarse dentro de un LibraryProvider");
  }

  return context;
}