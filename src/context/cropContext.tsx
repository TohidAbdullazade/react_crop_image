import { createContext, useState } from "react";

const cropContext = createContext<any>({});

const createContextProvider = ({ children }: any) => {
  const [image, setImage] = useState<any>();
  return (
    <cropContext.Provider value={{ image, setImage }}>
      {children}
    </cropContext.Provider>
  );
};
