import cc from "classcat";

import { IconComplete } from "./IconComplete";
import { Item } from "./Item";

import { useData } from "./DataContext";
import { useState } from "./StateContext";

function List() {
  const data = useData();
  const [state, setState] = useState();

  const getItemCompleted = (item) => state?.progress?.[item.name];

  const group = () => data.groups?.find((g) => g.name == state.selectedGroup);

  const itemsWithoutTags = data.items.filter(
    (item) => !item.tags.some((tag) => group().tags.includes(tag))
  );

  if (itemsWithoutTags.length) {
    console.warn(
      `Found ${itemsWithoutTags.length} items that did not match any tags: `,
      itemsWithoutTags
    );
  }

  return (
    <section class="w-full gap-4 columns-1 md:columns-2 lg:columns-3">
      <For each={group().tags}>
        {(tag) => {
          const items = data.items.filter((item) => item.tags.includes(tag));

          const itemsCompleted = () => items.filter(getItemCompleted).length;

          const percentage = () => (itemsCompleted() * 100) / items.length;
          const allComplete = () => itemsCompleted() == items.length;

          const classes = () =>
            cc([
              "flex",
              "inline-block",
              "mb-0",
              "cursor-pointer",
              "items-center",
              {
                "text-info": allComplete(),
              },
            ]);

          const handleHeaderClick = () => {
            setState("collapsed", {
              [tag]: !state?.collapsed?.[tag],
            });
          };

          const isCollapsed = () => !state?.collapsed?.[tag];

          return (
            <Show when={items.length > 0}>
              <div class="prose w-full break-inside-avoid-column mb-4">
                <h3 class={classes()} onclick={handleHeaderClick}>
                  <span class="grow">{tag}</span>
                  {allComplete() && <IconComplete class="inline-block mr-1" />}
                </h3>
                <Show when={isCollapsed()}>
                  <>
                    <progress
                      title={`${itemsCompleted()}/${items.length}`}
                      class="progress progress-info"
                      value={percentage()}
                      max="100"
                    />
                    <div class="mb-4">
                      <For each={items}>
                        {(item) => {
                          const isComplete = () => getItemCompleted(item);

                          const handleChange = (e) => {
                            setState("progress", {
                              [item.name]: e.target.checked || undefined,
                            });
                            if (allComplete()) {
                              setState("collapsed", {
                                [tag]: true,
                              });
                            }
                          };

                          const tags = item.tags.filter((t) => t !== tag);

                          return (
                            <Item
                              name={item.name}
                              tags={tags}
                              isComplete={isComplete()}
                              onChange={handleChange}
                            />
                          );
                        }}
                      </For>
                    </div>
                  </>
                </Show>
              </div>
            </Show>
          );
        }}
      </For>
    </section>
  );
}

export { List };
