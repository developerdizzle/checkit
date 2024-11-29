import "./App.css";

import data from "./sh2r.json";

import cc from "classcat";

import { createSignal, createEffect, createComputed } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";

import { IconComplete } from "./IconComplete";
import { Item } from "./Item";

function App() {
  const [state, setState] = makePersisted(
    createStore({
      selectedGroup: data.groups?.[0]?.name,
    }),
    {
      name: data.name,
    }
  );

  const getItemCompleted = (item) => state?.progress?.[item.name];

  const handleClear = () => {
    if (confirm("Clear progress?")) {
      setState("progress", undefined);
    }
  };

  const [group, setGroup] = createSignal("");

  createComputed(() =>
    setGroup(data.groups?.find((group) => group.name == state.selectedGroup))
  );

  const itemsCompleted = () => data.items.filter(getItemCompleted).length;
  const percentage = () => (itemsCompleted() * 100) / data.items.length;

  return (
    <>
      <header class="prose m-4 max-w-full">
        <h1 class="text-primary">{data.name}</h1>
        <progress
          class="progress progress-info"
          value={percentage()}
          max="100"
        />
      </header>
      <main class="m-6">
        <Show when={data.groups?.length}>
          <section>
            <div class="flex flex-row">
              <label class="label">Group by</label>
              <For each={data.groups}>
                {(group) => {
                  const isSelected = state.selectedGroup === group.name;

                  const handleChange = (e) => {
                    setState("selectedGroup", e.target.value);
                  };

                  return (
                    <label class="label cursor-pointer mr-2">
                      <span class="label-text mr-1">{group.name}</span>
                      <input
                        type="radio"
                        class="radio radio-accent"
                        name="group"
                        value={group.name}
                        checked={isSelected}
                        onchange={handleChange}
                      />
                    </label>
                  );
                }}
              </For>
            </div>
          </section>
        </Show>
        <section class="w-full gap-4 columns-1 md:columns-2 lg:columns-3">
          <For each={group().tags}>
            {(tag) => {
              const items = data.items.filter((item) =>
                item.tags.includes(tag)
              );

              const itemsCompleted = () =>
                items.filter(getItemCompleted).length;

              const percentage = () => (itemsCompleted() * 100) / items.length;
              const allComplete = () => itemsCompleted() == items.length;

              const classes = () =>
                cc([
                  "flex",
                  "inline-block",
                  "mb-0",
                  {
                    "text-info": allComplete(),
                  },
                ]);

              return (
                <Show when={items.length > 0}>
                  <div class="prose w-full break-inside-avoid-column mb-8">
                    <h3 class={classes()}>
                      <span class="grow">{tag}</span>
                      {allComplete() && (
                        <IconComplete class="inline-block mr-1" />
                      )}
                    </h3>
                    <progress
                      class="progress progress-info"
                      value={percentage()}
                      max="100"
                    />
                    <div>
                      <For each={items}>
                        {(item) => {
                          const isComplete = getItemCompleted(item);

                          const handleChange = (e) => {
                            setState("progress", {
                              [item.name]: e.target.checked || undefined,
                            });
                          };

                          const tags = item.tags.filter((t) => t !== tag);

                          return (
                            <Item
                              name={item.name}
                              tags={tags}
                              isComplete={isComplete}
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
        <p class="text-center mt-8">
          <button
            class="btn btn-secondary btn-outline btn-wide"
            onclick={handleClear}
          >
            Clear
          </button>
        </p>
      </main>
    </>
  );
}

export default App;
