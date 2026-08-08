import { useEffect, useState } from "react";

/**
 * Creates object URLs for uploaded files so they can be previewed, and
 * revokes them whenever the file list changes or the component unmounts.
 * Returns a ref-cleanup helper for removing individual previews.
 */
export const useObjectUrls = (files: File[] | null) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = (files ?? []).map((file) => URL.createObjectURL(file));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derive previews from files
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed);
      return next;
    });
  };

  return { previews, removePreview };
};