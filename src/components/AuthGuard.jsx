import { getAuth } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { Switch, Match } from "solid-js";

import { SignIn } from "./SignIn";
import { Loading } from "./Loading";

function AuthGuard(props) {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  return (
    <Switch fallback={<SignIn />}>
      <Match when={user.loading}>
        <Loading />
      </Match>
      <Match when={user.data}>{props.children}</Match>
    </Switch>
  );
}

export { AuthGuard };
