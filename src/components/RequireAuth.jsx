import { getAuth } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { Switch, Match, createEffect, onMount } from "solid-js";

import { Loading } from "./Loading";
import { useSignIn } from "./SignInContext";

function TriggerSignIn() {
  const [, setIsSignInOpen] = useSignIn();

  onMount(() => setIsSignInOpen(true));
}

function RequireAuth(Component) {
  return () => {
    const app = useFirebaseApp();
    const auth = getAuth(app);
    const user = useAuth(auth);

    return (
      <Switch fallback={<TriggerSignIn />}>
        <Match when={user.loading}>
          <Loading />
        </Match>
        <Match when={user.data}>
          <Component />
        </Match>
      </Switch>
    );
  };
}

export { RequireAuth };
