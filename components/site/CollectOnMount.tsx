"use client";

import { useEffect } from "react";
import { collect, type StickerId } from "@/lib/collectibles";

// Drops a sticker into the album when a page is opened.
export function CollectOnMount({ id }: { id: StickerId }) {
  useEffect(() => {
    collect(id);
  }, [id]);
  return null;
}
