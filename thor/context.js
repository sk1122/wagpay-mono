import { useEffect, FC, createContext, useContext, useState } from "react";
import { ethers } from "ethers";

export const AppContext = createContext({});
export const DropDowncontext = createContext({})

export function useAccountContext() {
  return useContext(AppContext);
}

export function useDropDownContext() {
  return useContext(DropDowncontext)
}

export default function D() {
  return <div></div>;
}
