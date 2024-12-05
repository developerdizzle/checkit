import {
  createContext,
  createSignal,
  createEffect,
  useContext,
} from "solid-js";
import cc from "classcat";
import { useFirebaseApp, useAuth } from "solid-firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

const SignInContext = createContext();

export function SignInProvider(props) {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const [isSignInOpen, setIsSignInOpen] = createSignal(false);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsSignInOpen(false);
    }
  });

  return (
    <SignInContext.Provider value={[isSignInOpen, setIsSignInOpen]}>
      <>
        {props.children}
        <dialog
          id="signin"
          class={cc({ modal: true, "modal-open": isSignInOpen() })}
        >
          <div class="modal-box text-center">
            <button class="btn btn-primary" onClick={signIn}>
              Sign in with Google
            </button>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button onClick={() => setIsSignInOpen(false)}>close</button>
          </form>
        </dialog>
      </>
    </SignInContext.Provider>
  );
}

export function useSignIn() {
  return useContext(SignInContext);
}
