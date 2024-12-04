import { Tabs } from "./Tabs";
import { List } from "./List";

import { useState } from "./StateContext";

function Preview(props) {
  const [state, setState] = useState();

  const handleSelectTab = (tab) => setState("selectedGroup", tab);

  const tabs = () => props.groups.map((g) => g.name);

  const handleCheckedItemsChanged = (checkedItems) =>
    setState("checkedItems", checkedItems);

  return (
    <>
      <Tabs
        selectedTab={state.selectedGroup}
        onSelectTab={handleSelectTab}
        tabs={tabs()}
      />
      <List
        groups={props.groups}
        selectedGroup={state.selectedGroup}
        items={props.items}
        checkedItems={state.checkedItems}
        onCheckedItemsChange={handleCheckedItemsChanged}
      />
    </>
  );
}

export { Preview };
