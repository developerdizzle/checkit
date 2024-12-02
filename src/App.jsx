import "./App.css";

import { Header } from "./Header";
import { Tabs } from "./Tabs";
import { List } from "./List";
import { ClearButton } from "./ClearButton";

import { DataProvider } from "./DataContext";
import { StateProvider } from "./StateContext";

function getListUrlPart() {
  return window.location.pathname.split("/")[1];
}

function App() {
  return (
    <DataProvider>
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

export default App;
