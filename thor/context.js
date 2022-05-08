import { useEffect, FC, createContext, useContext, useState } from "react";
import { ethers } from "ethers";

export const AppContext = createContext({});

export function useAccountContext() {
  return useContext(AppContext);
}

export default function D() {
  return <div></div>;
}
