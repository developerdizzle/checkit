import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { Switch, Match } from "solid-js";

function SignIn() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const signOut = () => auth.signOut();

  return (
    <Switch
      fallback={
        <button class="btn btn-primary" onClick={signIn}>
          Sign in with Google
        </button>
      }
    >
      <Match when={user.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={user.data}>
        <button class="btn" onclick={signOut}>
          Sign out
        </button>
      </Match>
    </Switch>
  );
}

export { SignIn };
