"use client";

import { useState, useEffect } from "react";

const AVATAR_KEY = "storeAvatar";
export const AVATAR_EVENT = "avatarChanged";

export function useAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(localStorage.getItem(AVATAR_KEY));

    function onAvatarChange() {
      setAvatarUrl(localStorage.getItem(AVATAR_KEY));
    }

    window.addEventListener(AVATAR_EVENT, onAvatarChange);
    return () => window.removeEventListener(AVATAR_EVENT, onAvatarChange);
  }, []);

  function saveAvatar(dataUrl: string | null) {
    if (dataUrl) localStorage.setItem(AVATAR_KEY, dataUrl);
    else localStorage.removeItem(AVATAR_KEY);
    setAvatarUrl(dataUrl);
    window.dispatchEvent(new Event(AVATAR_EVENT));
  }

  return { avatarUrl, saveAvatar };
}

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      const SIZE = 128;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      const scale = Math.max(SIZE / img.width, SIZE / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      URL.revokeObjectURL(blobUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = blobUrl;
  });
}
