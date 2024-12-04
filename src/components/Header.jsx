import { Show, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";

function Header(props) {
  const { topic } = useParams();

  const itemsLength = () => props.items?.length;

  const itemsCompleted = () => props.checkedItems?.length;
  const percentage = () => (itemsCompleted() * 100) / itemsLength();

  createEffect(() =>
    console.log(itemsCompleted(), itemsLength(), percentage())
  );

  return (
    <header class="prose m-4 max-w-full">
      <Show when={props.isOwner}>
        <a href={`${topic}/edit`} class="float-right">
          Edit this checklist
        </a>
      </Show>
      <h1 class="text-primary">{props.title}</h1>
      <progress
        title={`${itemsCompleted()}/${itemsLength()}`}
        class="progress progress-info rainbow-background"
        value={percentage()}
        max="100"
      />
      <sub class="float-right">
        {itemsCompleted()}/{itemsLength()}
      </sub>
    </header>
  );
}

export { Header };
