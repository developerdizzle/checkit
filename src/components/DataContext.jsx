import { createContext, useContext, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useFirebaseApp } from "solid-firebase";

import { Loading } from "./Loading";

const DataContext = createContext();

export function DataProvider(props) {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [docSnap] = createResource(async () => {
    const docSnap = await getDoc(doc(db, "topics", topic));

    return docSnap;
  });

  return (
    <Suspense fallback={<Loading />}>
      <Show when={docSnap()}>
        <Show when={docSnap().exists()} fallback={props.fallback}>
          <DataContext.Provider value={docSnap().data()}>
            {props.children}
          </DataContext.Provider>
        </Show>
      </Show>
    </Suspense>
  );
}

export function useData() {
  return useContext(DataContext);
}
