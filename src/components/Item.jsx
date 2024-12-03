function Item(props) {
  return (
    <div class="flex flex-col">
      <div class="form-control">
        <label class="cursor-pointer label flex flex-row">
          <span class="label-text grow">{props.name}&nbsp;</span>
          <For each={props.tags}>
            {(tag) => {
              return (
                <span class="badge badge-accent badge-sm badge-xoutline mr-2 truncate justify-normal">
                  {tag.toLowerCase()}
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
