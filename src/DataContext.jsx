import { createContext, useContext } from "solid-js";

const DataContext = createContext();

import data from "./sh2r.json";

export function DataProvider(props) {
  return (
    <DataContext.Provider value={data}>{props.children}</DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
