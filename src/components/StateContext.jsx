import { createContext, useContext, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { useData } from "./DataContext";

const StateContext = createContext();

export function StateProvider(props) {
  const { topic } = useParams();

  const [state, setState] = makePersisted(createStore({}), {
    name: topic,
  });

  return (
    <StateContext.Provider value={[state, setState]}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useState() {
  return useContext(StateContext);
}
