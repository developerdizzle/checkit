import { createEffect, createResource } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams } from "@solidjs/router";
import cc from "classcat";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { Loading } from "./Loading";

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
const db = getFirestore(app);

function TagSelect(props) {
  return (
    <select class="select" onchange={props.onchange} required={props.required}>
      <option value="">Select a tag</option>
      <For each={props.groups}>
        {(group) => (
          <optgroup label={group.name}>
            <For each={group.tags}>
              {(tag) => (
                <option selected={tag === props.selectedTag}>{tag}</option>
              )}
            </For>
          </optgroup>
        )}
      </For>
    </select>
  );
}

function Edit() {
  const { topic } = useParams();

  const [docSnap] = createResource(async () => {
    const docSnap = await getDoc(doc(db, "topics", topic));

    return docSnap;
  });

  createEffect(() => {
    if (docSnap()) {
      if (docSnap().exists()) {
        setState(docSnap().data());
      }
    }
  });

  const [state, setState] = createStore({
    title: "",
    groups: [],
    items: [],
  });

  const handleChangeTitle = (e) => {
    setState("title", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "topics", topic), unwrap(state));

      window.location.pathname = `/${topic}`;
    } catch (ex) {
      console.error(ex);
    }

    return false;
  };

  const handleNewGroupNameChange = (e) => {
    setState("groups", state.groups.length, {
      name: e.target.value,
      tags: [],
    });

    e.target.value = "";
  };

  const handleNewItemNameChange = (e) => {
    setState("items", state.items.length, {
      name: e.target.value,
      tags: [],
    });

    e.target.value = "";
  };

  createEffect(() => console.log("state", JSON.stringify(state)));

  return (
    <Suspense fallback={<Loading />}>
      <Show when={docSnap()}>
        <form
          class="h-screen flex flex-col items-center justify-center"
          onsubmit={handleSubmit}
        >
          <h1>
            Editor for <span class="text-secondary">{topic}</span>
          </h1>
          <ul class="steps steps-vertical">
            <li class={cc({ step: true, "step-primary": !!state.title })}>
              Set a name
            </li>
            <li
              class={cc({
                step: true,
                "step-primary":
                  state.groups.length > 0 && state.groups[0].tags.length > 0,
              })}
            >
              Create groups and tags
            </li>
            <li
              class={cc({
                step: true,
                "step-primary":
                  state.items.length > 0 && state.items[0].tags.length > 0,
              })}
            >
              Create items
            </li>
            <li class="step">Save</li>
          </ul>
          <section>
            <p>
              <input
                class="input input-bordered"
                type="text"
                name="title"
                placeholder="Set a title"
                value={state.title}
                onchange={handleChangeTitle}
                required
              />
            </p>
          </section>
          <section>
            <For each={state.groups}>
              {(group, g) => {
                const handleGroupNameChange = (e) => {
                  if (e.target.value) {
                    setState("groups", g(), {
                      name: e.target.value,
                    });
                  } else {
                    setState("groups", (groupState) =>
                      groupState.filter((_, i) => i !== g())
                    );
                  }
                };

                const [, setGroup] = createStore(group);

                const handleNewTagChange = (e) => {
                  setGroup("tags", group.tags.length, e.target.value);

                  e.target.value = "";
                };

                return (
                  <p>
                    <input
                      class="input input-bordered"
                      type="text"
                      value={group.name}
                      onchange={handleGroupNameChange}
                      placeholder="Group name"
                    />
                    <For each={group.tags}>
                      {(tag, t) => {
                        const handleTagChange = (e) => {
                          if (e.target.value) {
                            setGroup("tags", t(), e.target.value);
                          } else {
                            setGroup("tags", (tagsState) =>
                              tagsState.filter((_, i) => i !== t())
                            );
                          }
                        };

                        return (
                          <input
                            class="input input-bordered"
                            type="text"
                            value={tag}
                            onchange={handleTagChange}
                            placeholder="Add new tag"
                          />
                        );
                      }}
                    </For>
                    <input
                      class="input input-bordered"
                      type="text"
                      onchange={handleNewTagChange}
                      required={group.tags.length === 0}
                      placeholder="Add new tag"
                    />
                  </p>
                );
              }}
            </For>
            <p>
              <input
                class="input input-bordered"
                type="text"
                placeholder="Add a new group"
                onchange={handleNewGroupNameChange}
                required={state.groups.length === 0}
              />
            </p>
          </section>
          <section>
            <For each={state.items}>
              {(item, i) => {
                const handleItemNameChange = (e) => {
                  if (e.target.value) {
                    setState("items", i(), {
                      name: e.target.value,
                    });
                  } else {
                    setState("items", (itemState) =>
                      itemState.filter((_, idx) => idx !== i())
                    );
                  }
                };

                const [, setItem] = createStore(item);

                const handleNewItemTagChange = (e) => {
                  setItem("tags", item.tags.length, e.target.value);

                  e.target.value = "";
                };

                return (
                  <p>
                    <input
                      class="input input-bordered"
                      type="text"
                      value={item.name}
                      onchange={handleItemNameChange}
                      placeholder="Item name"
                    />
                    <For each={item.tags}>
                      {(tag, t) => {
                        const handleItemTagChange = (e) => {
                          if (e.target.value) {
                            setItem("tags", t(), e.target.value);
                          } else {
                            setItem("tags", (tagsState) =>
                              tagsState.filter((_, i) => i !== t())
                            );
                          }
                        };

                        return (
                          <TagSelect
                            groups={state.groups}
                            selectedTag={tag}
                            onchange={handleItemTagChange}
                          />
                          // <input
                          //   class="input input-bordered"
                          //   type="text"
                          //   value={tag}
                          //   onchange={handleItemTagChange}
                          //   placeholder="Add new tag"
                          // />
                        );
                      }}
                    </For>
                    <TagSelect
                      groups={state.groups}
                      onchange={handleNewItemTagChange}
                      required={item.tags.length === 0}
                    />
                    {/* <input
                  class="input input-bordered"
                  type="text"
                  onchange={handleNewItemTagChange}
                  required={item.tags.length === 0}
                  placeholder="Add new tag"
                /> */}
                  </p>
                );
              }}
            </For>
            <p>
              <input
                class="input input-bordered"
                type="text"
                placeholder="Add a new item"
                onchange={handleNewItemNameChange}
                required={state.items.length === 0}
              />
            </p>
          </section>
          <section>
            <p>
              <button class="btn btn-primary" type="submit">
                Save
              </button>
            </p>
          </section>
        </form>
      </Show>
    </Suspense>
  );
}

export { Edit };
