import { createContext } from "solid-js";
import { createEffect, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";

const DataContext = createContext();

export function DataProvider(props) {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [docSnap] = createResource(() => getDoc(doc(db, "topics", topic)));

  const data = () => docSnap()?.data();

  return (
    <DataContext.Provider value={data()}>{props.children}</DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
