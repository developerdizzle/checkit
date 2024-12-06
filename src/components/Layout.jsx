import { DataProvider } from "./DataContext";

function Layout(props) {
  // const data = useData();

  // createEffect(() => console.log("data", data));

  return (
    <DataProvider>
      <Header />
      {props.children}
    </DataProvider>
  );
}

export { Layout };
