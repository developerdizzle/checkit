import { Show, createEffect, createComputed } from "solid-js";
import { useParams } from "@solidjs/router";
import { useFirebaseApp, useAuth } from "solid-firebase";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { useSignIn } from "./SignInContext";

function Header(props) {
  const { topic } = useParams();

  const itemsLength = () => props.items.length;

  const itemsCompleted = () => props.checkedItems?.length || 0;
  const percentage = () => (itemsCompleted() * 100) / itemsLength();

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const [isSignInOpen, setIsSignInOpen] = useSignIn();

  const signOut = () => auth.signOut();

  return (
    <header>
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <h1 class="text-2xl text-primary">{props.title}</h1>
        </div>
        <div class="navbar-end">
          <Show when={props.isOwner}>
            <a class="btn btn-ghost btn-circle" href={`${topic}/edit`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </a>
          </Show>
          <Show when={!user.data}>
            <button
              class="btn btn-ghost btn-circle"
              onClick={() => setIsSignInOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
              </svg>
            </button>
          </Show>
          <Show when={user.data}>
            <button class="btn btn-ghost btn-circle" onclick={signOut}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </svg>
            </button>
          </Show>
        </div>
      </div>
      {/* <progress
        title={`${itemsCompleted()}/${itemsLength()}`}
        class="progress progress-info ml-4 mr-4"
        value={percentage()}
        max="100"
      />
      <span class="text-xs">
        {itemsCompleted()}/{itemsLength()}
      </span> */}
    </header>

    // {/* // <header class="prose m-4 max-w-full">
    //   <h1 class="text-primary">{props.title}</h1>
    //   <Show when={props.isOwner}>
    //     <a href={`${topic}/edit`}>Edit this checklist</a>
    //   </Show>
    //   <progress
    //     title={`${itemsCompleted()}/${itemsLength()}`}
    //     class="progress progress-info rainbow-background"
    //     value={percentage()}
    //     max="100"
    //   />
    //   <sub class="float-right">
    //     {itemsCompleted()}/{itemsLength()}
    //   </sub>
    // </header> */}
  );
}

export { Header };
