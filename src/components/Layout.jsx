import { useFirebaseApp, useAuth } from "solid-firebase";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { useSignIn } from "./SignInContext";

function Layout(props) {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const [isSignInOpen, setIsSignInOpen] = useSignIn();

  const signOut = () => auth.signOut();

  return (
    <>
      {/* <Show when={!user.data}>
        <button
          class="btn btn-circle float-right"
          onClick={() => setIsSignInOpen(true)}
        >
          Sign in
        </button>
      </Show>
      <Show when={user.data}>
        <button class="btn float-right" onclick={signOut}>
          Sign out
        </button>
      </Show> */}
      {props.children}
      {/* <dialog id="signin" class="modal">
        <div class="modal-box text-center">
          <button class="btn btn-primary" onClick={signIn}>
            Sign in with Google
          </button>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog> */}
    </>
  );
}

export { Layout };
