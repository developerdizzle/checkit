import { createEffect } from "solid-js";
import cc from "classcat";

function Tabs(props) {
  const selectedTab = () => props.selectedTab || props.tabs[0];

  return (
    <Show when={props.tabs.length > 1}>
      <section>
        <div
          role="tablist"
          class="tabs tabs-bordered tabs-lg md:w-1/2 mx-auto mb-8 not-prose"
        >
          <For each={props.tabs}>
            {(tab) => {
              const classes = () => {
                return cc({
                  tab: true,
                  "tab-active": tab === selectedTab(),
                });
              };

              const handleClick = () => {
                props.onSelectTab(tab);
              };

              return (
                <a role="tab" class={classes()} onclick={handleClick}>
                  By {tab.toLowerCase()}
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
