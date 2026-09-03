import { useEffect } from "react";

interface ShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export function useKeyboardShortcut(
  options: ShortcutOptions,
  callback: (event: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toLowerCase() === options.key.toLowerCase();
      const isCtrlOrMetaMatch = options.ctrlKey || options.metaKey
        ? event.ctrlKey || event.metaKey
        : true;
      const isShiftMatch = options.shiftKey ? event.shiftKey : true;
      const isAltMatch = options.altKey ? event.altKey : true;

      if (isKeyMatch && isCtrlOrMetaMatch && isShiftMatch && isAltMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, callback]);
}
