import { Header } from "./Header";
import { Tabs } from "./Tabs";
import { List } from "./List";
import { ClearButton } from "./ClearButton";

import { useData } from "./DataContext";
import { useState } from "./StateContext";

function App() {
  const data = useData();
  const [state, setState] = useState();

  return (
    <>
      <Header data={data} state={state} />
      <main class="m-6 mt-0">
        <Tabs data={data} state={state} setState={setState} />
        <List data={data} state={state} setState={setState} />
        <ClearButton setState={setState} />
      </main>
    </>
  );
}

export { App };
