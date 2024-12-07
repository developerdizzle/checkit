import "./index.css";

import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { initializeApp } from "firebase/app";
import { FirebaseProvider } from "solid-firebase";

import { Layout } from "./components/Layout";

import { Home } from "./pages/Home";
import { App } from "./pages/App";
import { Edit } from "./pages/Edit";

import { RequireAuth } from "./components/RequireAuth";
import { SignInProvider } from "./components/SignInContext";
import { DataProvider } from "./components/DataContext";

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
          <Route path="/:topic" component={App} />
          <Route path="/:topic/edit" component={RequireAuth(Edit)} />
        </Router>
      </SignInProvider>
    </FirebaseProvider>
  ),
  document.getElementById("root")
);
