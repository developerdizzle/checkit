import { createContext, useContext, createResource } from "solid-js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

import { Loading } from "./Loading";
import { getTopic } from "./getTopic";

const firebaseConfig = {
  apiKey: "AIzaSyDDz690srkGOWLbWXuGYeQCGm2vYuKL35A",
  authDomain: "checkit-ac32f.firebaseapp.com",
  projectId: "checkit-ac32f",
  storageBucket: "checkit-ac32f.firebasestorage.app",
  messagingSenderId: "717347341482",
  appId: "1:717347341482:web:1cc11e7c4b90391553fcd3",
  measurementId: "G-9F2MBBN0Z9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DataContext = createContext();

// import data from "./sh2r.json";

export function DataProvider(props) {
  const topic = getTopic();
  console.log("topic", topic);

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
