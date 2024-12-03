import { Show, createEffect } from "solid-js";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";
import { useParams } from "@solidjs/router";

import { useState } from "./StateContext";
import { useData } from "./DataContext";

function Header() {
  const { topic } = useParams();

  const data = useData();
  const [state] = useState();

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const getItemCompleted = (item) => state?.progress?.[item.name];

  const itemsCompleted = () => data.items.filter(getItemCompleted).length;
  const percentage = () => (itemsCompleted() * 100) / data.items.length;

  const isOwner = () => user?.data?.uid === data?.uid;

  return (
    <header class="prose m-4 max-w-full">
      <Show when={isOwner()}>
        <a href={`${topic}/edit`} class="float-right">
          Edit this checklist
        </a>
      </Show>
      <h1 class="text-primary">{data.title}</h1>
      <progress
        title={`${itemsCompleted()}/${data.items.length}`}
        class="progress progress-info rainbow-background"
        value={percentage()}
        max="100"
      />
      <sub class="float-right">
        {itemsCompleted()}/{data.items.length}
      </sub>
    </header>
  );
}

export { Header };
