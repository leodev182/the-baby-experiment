import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useEventConfig } from "../hooks/useEventConfig";
import type { EventConfig } from "../types";

interface EventConfigContextValue {
  config: EventConfig | null;
  loading: boolean;
  error: string | null;
}

const EventConfigContext = createContext<EventConfigContextValue | undefined>(
  undefined
);

export function EventConfigProvider({ children }: { children: ReactNode }) {
  // ✅ useEventConfig se llama UNA SOLA VEZ aquí
  const eventConfigData = useEventConfig();

  return (
    <EventConfigContext.Provider value={eventConfigData}>
      {children}
    </EventConfigContext.Provider>
  );
}

export function useEventConfigContext() {
  const context = useContext(EventConfigContext);

  if (context === undefined) {
    throw new Error(
      "useEventConfigContext debe usarse dentro de EventConfigProvider"
    );
  }

  return context;
}
