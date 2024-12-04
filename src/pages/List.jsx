import { ClaimTopic } from "../components/ClaimTopic";

import { App } from "../components/App";

import { DataProvider } from "../components/DataContext";
import { StateProvider } from "../components/StateContext";

function List() {
  return (
    <DataProvider fallback={<ClaimTopic />}>
      <StateProvider>
        <App />
      </StateProvider>
    </DataProvider>
  );
}

export { List };
