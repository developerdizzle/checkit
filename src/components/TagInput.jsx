import { createEffect } from "solid-js";
import { ReactiveSet } from "@solid-primitives/set";

function TagInput(props) {
  const tags = new ReactiveSet(props.tags);

  const onKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      tags.add(e.target.value);
      e.target.value = "";
      return false;
    }
  };

  const onClick = (e) => {
    tags.delete(e.target.innerText);
  };

  createEffect(() => props?.onChange(Array.from(tags)));

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-row flex-grow flex-wrap items-center gap-2">
        <For each={Array.from(tags)}>
          {(tag) => (
            <span
              class="badge badge-accent badge-sm truncate justify-normal cursor-pointer"
              onClick={onClick}
            >
              {tag}
            </span>
          )}
        </For>
      </div>
      <label class="input input-bordered flex flex-grow items-center gap-2">
        <input
          type="text"
          class="grow placeholder:opacity-60"
          placeholder="Add a tag"
          list={props.list}
          onKeyPress={onKeyPress}
        />
      </label>
    </div>
  );
}

export { TagInput };
