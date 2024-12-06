import { createEffect, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";

import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

import { Header } from "../components/Header";
import { Tabs } from "../components/Tabs";
import { List } from "../components/List";
import { ClearButton } from "../components/ClearButton";
import { ClaimTopic } from "../components/ClaimTopic";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";

function App() {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = useAuth(auth);

  const [docSnap] = createResource(() => getDoc(doc(db, "topics", topic)));

  const data = () => docSnap()?.data();

  const [state, setState] = makePersisted(createStore({}), {
    name: topic,
  });

  const handleSelectTab = (tab) => setState("selectedGroup", tab);

  const tabs = () => data().groups.map((g) => g.name);

  const handleCheckedItemsChanged = (checkedItems) =>
    setState("checkedItems", checkedItems);

  const isOwner = () => data().uid === user?.data?.uid;

  const handleClearProgress = () => setState("checkedItems", undefined);

  return (
    <Suspense fallback={<Loading />}>
      <Show when={data()} fallback={<ClaimTopic />}>
        <Header title={data().title} isOwner={isOwner()} />
        <main class="p-6 pt-0">
          <h1 class="text-2xl md:text-4xl text-primary font-bold">
            {data().title}
          </h1>
          <ProgressBar items={data().items} checkedItems={state.checkedItems} />
          <Tabs
            selectedTab={state.selectedGroup}
            onSelectTab={handleSelectTab}
            tabs={tabs()}
          />
          <List
            groups={data().groups}
            selectedGroup={state.selectedGroup}
            items={data().items}
            checkedItems={state.checkedItems || []}
            onCheckedItemsChange={handleCheckedItemsChanged}
          />
          <ClearButton onClear={handleClearProgress} />
        </main>
      </Show>
    </Suspense>
  );
}

export { App };
