import cc from "classcat";
import { useData } from "./DataContext";
import { useState } from "./StateContext";

function Tabs() {
  const data = useData();
  const [state, setState] = useState();

  const handleSelectGroup = (group) => setState("selectedGroup", group.name);

  return (
    <Show when={data.groups?.length}>
      <section>
        <div
          role="tablist"
          class="tabs tabs-bordered tabs-lg md:w-1/2 mx-auto mb-8"
        >
          <For each={data.groups}>
            {(tab, i) => {
              const isSelected = () => tab.name === state.selectedGroup;
              const classes = () => {
                return cc({
                  tab: true,
                  "tab-active": isSelected(),
                });
              };

              const handleClick = () => {
                handleSelectGroup(tab);
              };

              return (
                <a role="tab" class={classes()} onclick={handleClick}>
                  Group by {tab.name.toLowerCase()}
                </a>
              );
            }}
          </For>
        </div>
      </section>
    </Show>
  );
}

export { Tabs };
