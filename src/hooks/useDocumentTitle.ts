import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "Tarun Chess Academy — Chess Classes, Camps & Tournaments";
    };
  }, [title]);
}
