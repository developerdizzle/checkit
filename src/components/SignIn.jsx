import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { Switch, Match } from "solid-js";

import { Loading } from "./Loading";

function SignIn() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signOut = () => auth.signOut();

  return (
    <div class="h-screen flex items-center justify-center">
      <Switch
        fallback={
          <button class="btn btn-primary" onClick={signIn}>
            Sign in with Google
          </button>
        }
      >
        <Match when={user.loading}>
          <Loading />
        </Match>
        <Match when={user.data}>
          <button class="btn" onclick={signOut}>
            Sign out
          </button>
        </Match>
      </Switch>
    </div>
  );
}

export { SignIn };
