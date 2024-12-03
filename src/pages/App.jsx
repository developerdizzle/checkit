import { ClaimTopic } from "../components/ClaimTopic";
import { Header } from "../components/Header";
import { Tabs } from "../components/Tabs";
import { List } from "../components/List";
import { ClearButton } from "../components/ClearButton";

import { DataProvider } from "../components/DataContext";
import { StateProvider } from "../components/StateContext";

function App() {
  return (
    <DataProvider fallback={<ClaimTopic />}>
      <StateProvider>
        <Header />
        <main class="m-6 mt-0">
          <Tabs />
          <List />
          <ClearButton />
        </main>
      </StateProvider>
    </DataProvider>
  );
}

export { App };
