function Item(props) {
  return (
    <label class="cursor-pointer flex flex-col gap-1">
      <div class="flex flex-row gap-2">
        <span class="flex flex-row flex-wrap grow items-center justify-end gap-1">
          <span class="text-md grow">{props.name}</span>
          <For each={props.tags}>
            {(tag) => {
              return (
                <span class="badge badge-accent badge-sm justify-self-end xjustify-normal">
                  {tag}
                </span>
              );
            }}
          </For>
        </span>
        <input
          type="checkbox"
          checked={props.isComplete}
          class="checkbox checkbox-info"
          onchange={props.onChange}
        />
      </div>
      <Show when={props.description}>
        <div class="opacity-60 text-xs">{props.description}</div>
      </Show>
    </label>
  );
}

export { Item };
