import { useState } from "./StateContext";
import { useData } from "./DataContext";

function Header() {
  const data = useData();
  const [state, setState] = useState();

  const getItemCompleted = (item) => state?.progress?.[item.name];

  const itemsCompleted = () => data.items.filter(getItemCompleted).length;
  const percentage = () => (itemsCompleted() * 100) / data.items.length;

  return (
    <header class="prose m-4 max-w-full">
      <h1 class="text-primary">{data.name}</h1>
      <progress
        title={`${itemsCompleted()}/${data.items.length}`}
        class="progress progress-info rainbow-background"
        value={percentage()}
        max="100"
      />
      <sub class="float-right">
        {itemsCompleted()}/{data.items.length}
      </sub>
    </header>
  );
}

export { Header };
