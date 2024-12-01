import cc from "classcat";

function Tabs(props) {
  return (
    <div
      role="tablist"
      class="tabs tabs-bordered tabs-lg md:w-1/2 mx-auto mb-8"
    >
      <For each={props.tabs}>
        {(tab, i) => {
          const isSelected = () => tab.name === props.selectedTab;
          const classes = () => {
            return cc({
              tab: true,
              "tab-active": isSelected(),
            });
          };

          const handleClick = () => {
            props.onSelectTab(tab);
          };

          return (
            <a role="tab" class={classes()} onclick={handleClick}>
              Group by {tab.name.toLowerCase()}
            </a>
          );
        }}
      </For>
    </div>
  );
}

export { Tabs };
