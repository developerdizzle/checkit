function Item(props) {
  return (
    <div class="flex flex-col">
      <div class="form-control">
        <label class="cursor-pointer label flex flex-row">
          <span class="label-text grow">{props.name}&nbsp;</span>
          <For each={props.tags}>
            {(tag) => {
              return (
                <span class="badge badge-accent badge-sm badge-outline mr-2">
                  {tag}
                </span>
              );
            }}
          </For>
          <input
            type="checkbox"
            checked={props.isComplete}
            class="checkbox checkbox-info"
            onchange={props.onChange}
          />
        </label>
      </div>
    </div>
  );
}

export { Item };
