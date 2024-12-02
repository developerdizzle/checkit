import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { useData } from "./DataContext";

const StateContext = createContext();

export function StateProvider(props) {
  const data = useData();

  const [state, setState] = makePersisted(
    createStore({
      selectedGroup: data?.groups?.[0]?.name,
    }),
    {
      name: data?.name,
    }
  );

  return (
    <StateContext.Provider value={[state, setState]}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState() {
  return useContext(StateContext);
}
