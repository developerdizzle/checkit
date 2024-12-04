import { Show, createEffect } from "solid-js";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";
import { useParams } from "@solidjs/router";

function Header(props) {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const getItemCompleted = (item) => props.state?.progress?.[item.name];

  const itemsCompleted = () => props.data.items.filter(getItemCompleted).length;
  const percentage = () => (itemsCompleted() * 100) / props.data.items.length;

  const isOwner = () => user?.data?.uid === props.data?.uid;

  return (
    <header class="prose m-4 max-w-full">
      <Show when={isOwner()}>
        <a href={`${topic}/edit`} class="float-right">
          Edit this checklist
        </a>
      </Show>
      <h1 class="text-primary">{props.data.title}</h1>
      <progress
        title={`${itemsCompleted()}/${props.data.items.length}`}
        class="progress progress-info rainbow-background"
        value={percentage()}
        max="100"
      />
      <sub class="float-right">
        {itemsCompleted()}/{props.data.items.length}
      </sub>
    </header>
  );
}

export { Header };
