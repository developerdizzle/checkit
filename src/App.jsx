import "./App.css";

import data from "./sh2r.json";

import { createSignal, createEffect, createComputed } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { makePersisted } from "@solid-primitives/storage";
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

  const handleClear = () => {
    if (confirm("Clear progress?")) {
      setState("progress", undefined);
    }
  };

  const [group, setGroup] = createSignal("");

  createComputed(() => console.log("state", JSON.stringify(state)));
  createComputed(() =>
    setGroup(data.groups?.find((group) => group.name == state.selectedGroup))
  );

  return (
    <section class="prose">
      <h1 class="text-x1">{data.name}</h1>
      <Show when={data.groups?.length}>
        <section>
          <div class="flex flex-row">
            <span class="text-bold">Group by</span>
            <For each={data.groups}>
              {(group) => {
                const isSelected = state.selectedGroup === group.name;

                const handleChange = (e) => {
                  console.log("e", e);
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
      <Show when={!group()}>
        <div>
          <For each={data.items}>
            {(item) => {
              const isComplete = state?.progress?.[item.name];

              const handleChange = (e) => {
                setState("progress", {
                  [item.name]: e.target.checked || undefined,
                });
              };

              return (
                <Item
                  name={item.name}
                  tags={item.tags}
                  isComplete={isComplete}
                  onChange={handleChange}
                />
              );
            }}
          </For>
        </div>
      </Show>
      <Show when={group()}>
        <div>
          <For each={group().tags}>
            {(tag) => {
              const items = data.items.filter((item) =>
                item.tags.includes(tag)
              );
              return (
                <div>
                  <h3>{tag}</h3>
                  <div>
                    <For each={items}>
                      {(item) => {
                        const isComplete = state?.progress?.[item.name];

                        const handleChange = (e) => {
                          setState("progress", {
                            [item.name]: e.target.checked || undefined,
                          });
                        };

                        return (
                          <Item
                            name={item.name}
                            tags={item.tags}
                            isComplete={isComplete}
                            onChange={handleChange}
                          />
                        );
                      }}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
      <p class="text-center mt-8">
        <button
          class="btn btn-secondary btn-outline btn-wide"
          onclick={handleClear}
        >
          Clear
        </button>
      </p>
    </section>
  );
}

export default App;
