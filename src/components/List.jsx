import cc from "classcat";
import { createEffect, createSignal } from "solid-js";
import { Item } from "./Item";

function List(props) {
  const [checkedItems, setCheckedItems] = createSignal(
    props.checkedItems || []
  );

  const getItemCompleted = (item) => checkedItems().includes(item.name);

  createEffect(() => setCheckedItems(props.checkedItems || []));
  createEffect(() => props.onCheckedItemsChange(checkedItems()));

  const group = () =>
    props.groups.find((g) => g.name == props.selectedGroup) || props.groups[0];

  const itemsWithoutTags = () =>
    props.items.filter(
      (item) => !item.tags.some((tag) => group().tags.includes(tag))
    );

  if (itemsWithoutTags().length) {
    console.warn(
      `Found ${itemsWithoutTags().length} items that did not match any tags: `,
      itemsWithoutTags()
    );
  }

  return (
    <section class="w-full gap-4 columns-1 md:columns-2 lg:columns-3">
      <For each={group().tags}>
        {(tag) => {
          const items = () =>
            props.items.filter((item) => item.tags.includes(tag));

          const itemsCompleted = () => items().filter(getItemCompleted).length;

          const percentage = () => (itemsCompleted() * 100) / items().length;
          const allComplete = () => itemsCompleted() == items().length;

          return (
            <Show when={items().length > 0}>
              <div class="break-inside-avoid-column mb-4">
                <h3
                  class={cc([
                    "flex",
                    "text-lg",
                    "font-bold",
                    {
                      "text-info": allComplete(),
                    },
                  ])}
                >
                  {tag}
                </h3>
                <progress
                  title={`${itemsCompleted()}/${items().length}`}
                  class="progress progress-info"
                  value={percentage()}
                  max="100"
                />
                <div class="mb-4">
                  <For each={items()}>
                    {(item) => {
                      const isComplete = () => getItemCompleted(item);

                      const handleChange = (e) => {
                        if (e.target.checked) {
                          setCheckedItems((si) => [...si, item.name]);
                        } else {
                          setCheckedItems((si) =>
                            si.filter((i) => i !== item.name)
                          );
                        }
                      };

                      const tags = () => item.tags.filter((t) => t !== tag);

                      return (
                        <Item
                          name={item.name}
                          tags={tags()}
                          isComplete={isComplete()}
                          onChange={handleChange}
                        />
                      );
                    }}
                  </For>
                </div>
              </div>
            </Show>
          );
        }}
      </For>
    </section>
  );
}

export { List };
