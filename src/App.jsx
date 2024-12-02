import "./App.css";

import { ClaimTopic } from "./ClaimTopic";
import { Header } from "./Header";
import { Tabs } from "./Tabs";
import { List } from "./List";
import { ClearButton } from "./ClearButton";

import { DataProvider } from "./DataContext";
import { StateProvider } from "./StateContext";

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
