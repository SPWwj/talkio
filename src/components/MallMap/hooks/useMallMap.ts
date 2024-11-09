import { useContext } from "react";
import { MallMapContext } from "../context/MallMapContext";
import { MallMapContextType } from "../types";

export const useMallMap = (): MallMapContextType => {
  const context = useContext(MallMapContext);
  if (!context) {
    throw new Error("useMallMap must be used within MallMapProvider");
  }
  return context;
};