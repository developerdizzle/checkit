import {
  createContext,
  createEffect,
  useContext,
  createResource,
} from "solid-js";
import { useParams } from "@solidjs/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useFirebaseApp } from "solid-firebase";

import { Loading } from "./Loading";

const DataContext = createContext();

export function DataProvider(props) {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [docSnap] = createResource(() => getDoc(doc(db, "topics", topic)));

  const data = () => docSnap()?.data();

  return (
    <Suspense fallback={<Loading />}>
      <Show when={data()} fallback={props.fallback}>
        <DataContext.Provider value={data()}>
          {props.children}
        </DataContext.Provider>
      </Show>
    </Suspense>
  );
}

export function useData() {
  return useContext(DataContext);
}
