// DEMO realtime: refreshes when demo data changes (also across tabs, e.g. "Cocina" in a second tab).
import { useEffect, useRef } from "react";
import { DEMO_CHANGE_EVENT } from "@/services/db";

export function useRealtimePedidos(onUpdate: () => void) {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const fire = () => {
      clearTimeout(t);
      t = setTimeout(() => callbackRef.current(), 150);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sazon_demo_db_v1") fire();
    };
    window.addEventListener(DEMO_CHANGE_EVENT, fire);
    window.addEventListener("storage", onStorage);
    return () => {
      clearTimeout(t);
      window.removeEventListener(DEMO_CHANGE_EVENT, fire);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}
