import { Show, createEffect, createComputed } from "solid-js";
import { useParams, useMatch, useCurrentMatches } from "@solidjs/router";
import { useFirebaseApp, useAuth } from "solid-firebase";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useData } from "./DataContext";

import { useSignIn } from "./SignInContext";

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
    </svg>
  );
}

function Header(props) {
  const { topic } = useParams();

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const user = useAuth(auth);

  const [isSignInOpen, setIsSignInOpen] = useSignIn();

  const signOut = () => auth.signOut();

  const editPath = `/${topic}/edit`;

  const isEditPage = useMatch(() => editPath);

  const matches = useCurrentMatches();

  createEffect(() =>
    console.log("matches", matches(), matches().at(-1).route.info.breadcrumbs)
  );

  const path = () => matches().at(-1).route.key.path;

  createEffect(() => console.log("path", path()));

  return (
    <header class="pl-4 pr-4">
      <div class="navbar">
        <div class="navbar-start grow">
          <div class="breadcrumbs text-sm">
            <ul>
              <Switch>
                <Match when={path() === "/:topic"}>
                  <li>
                    <a href="/">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                      </svg>
                    </a>
                  </li>
                </Match>
                <Match when={path() === "/:topic/edit"}>
                  <li>
                    <a href={`/${topic}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-5"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                      </svg>
                    </a>
                  </li>
                </Match>
              </Switch>
            </ul>
          </div>
        </div>
        <div class="navbar-end w-auto">
          <Show when={props.isOwner && !isEditPage()}>
            <a class="btn btn-ghost btn-circle" href={editPath}>
              <EditIcon />
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
    </header>
  );
}

export { Header };
