// src/Contexts/PhotonContext.tsx
import { createContext, useContext, useState } from "react";

export const PhotonContext = createContext<any>(null);

export function PhotonProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<any>(null);
  return (
    <PhotonContext.Provider value={{ client, setClient }}>
      {children}
    </PhotonContext.Provider>
  );
}

export const usePhoton = () => useContext(PhotonContext);
