"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type EditContextType = {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <EditContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (!context) throw new Error("useEdit must be used within EditProvider");
  return context;
};