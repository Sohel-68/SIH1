import { useEffect } from "react";
import { useSyncStore } from "@/stores/use-sync-store";

export function useOnlineStatus() {
  const { isOnline, setIsOnline } = useSyncStore();

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  return isOnline;
}
