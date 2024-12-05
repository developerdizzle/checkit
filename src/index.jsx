import "./index.css";

import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { initializeApp } from "firebase/app";
import { FirebaseProvider } from "solid-firebase";

import { Home } from "./pages/Home";
import { List } from "./pages/List";
import { Edit } from "./pages/Edit";
import { SignIn } from "./components/SignIn";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { SignInProvider } from "./components/SignInContext";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("Wrapper div not found");
}

const firebaseConfig = {
  apiKey: "AIzaSyDDz690srkGOWLbWXuGYeQCGm2vYuKL35A",
  authDomain: "checkit-ac32f.firebaseapp.com",
  projectId: "checkit-ac32f",
  storageBucket: "checkit-ac32f.firebasestorage.app",
  messagingSenderId: "717347341482",
  appId: "1:717347341482:web:1cc11e7c4b90391553fcd3",
  measurementId: "G-9F2MBBN0Z9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

render(
  () => (
    <FirebaseProvider app={app}>
      <SignInProvider>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/" component={AuthGuard}>
            <Route path="/:topic/edit" component={Edit} />
          </Route>
          <Route path="/:topic" component={Layout}>
            <Route path="/" component={List} />
          </Route>
        </Router>
      </SignInProvider>
    </FirebaseProvider>
  ),
  document.getElementById("root")
);
