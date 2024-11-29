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
    <>
      <header class="prose">
        <h1 class="text-x1">{data.name}</h1>
      </header>
      <main class="prose">
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
        <section>
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
