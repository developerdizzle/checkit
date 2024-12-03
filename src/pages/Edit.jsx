import { createEffect, createResource } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams } from "@solidjs/router";
import cc from "classcat";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";

import { Loading } from "../components/Loading";

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

  const app = useFirebaseApp();
  const db = getFirestore(app);

  const auth = getAuth(app);
  const user = useAuth(auth);

  const [docSnap] = createResource(async () => {
    const docSnap = await getDoc(doc(db, "topics", topic));

    return docSnap;
  });

  const [state, setState] = createStore({
    title: "",
    groups: [],
    items: [],
  });

  createEffect(() => {
    if (user.data) {
      setState("uid", user.data.uid);
    }
  });

  createEffect(() => {
    if (docSnap()) {
      if (docSnap().exists()) {
        setState(docSnap().data());
      }
    }
  });

  createEffect(() => {
    window.loadJSON = (json) => setState(json);
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

  const step1Complete = () => !!state.title;
  const step2Complete = () =>
    state.groups.length > 0 && state.groups[0].tags.length > 0;
  const step3Complete = () =>
    state.items.length > 0 && state.items[0].tags.length > 0;

  return (
    <Suspense fallback={<Loading />}>
      <Show when={docSnap()}>
        <form class="h-screen flex flex-row" onsubmit={handleSubmit}>
          <div class="w-1/3 content-center p-8">
            <ul class="steps steps-vertical">
              <li
                class={cc({
                  "mb-2": true,
                  step: true,
                  "step-primary": step1Complete(),
                })}
              >
                <div class="text-left align-top">
                  <h3>Set a title</h3>
                  <sub>This will show up at the top of the checklist page.</sub>
                </div>
              </li>
              <li
                class={cc({
                  "mb-2": true,
                  step: true,
                  "step-primary": step2Complete(),
                })}
              >
                <div class="text-left align-top">
                  <h3>Add groups and tags</h3>
                  <sub>
                    Tags are characteristics of a checklist item (e.g.: sword,
                    Lake Hylia, etc.). A group is a category of tags (e.g.:
                    type, location, etc.).
                  </sub>
                </div>
              </li>
              <li
                class={cc({
                  "mb-2": true,
                  step: true,
                  "step-primary": step3Complete(),
                })}
              >
                <div class="text-left align-top">
                  <h3>Add items</h3>
                  <sub>
                    Items are the actual checklist boxes. Each item can have one
                    or more tags (defined above) to describe it.
                  </sub>
                </div>
              </li>
              <li class="step" data-content="✓">
                <p>
                  <button class="btn btn-primary" type="submit">
                    Save
                  </button>
                </p>
              </li>
            </ul>
          </div>
          <div class="flex-1 flex overflow-hidden w-2/3 max-w-full prose">
            <div class="flex-1 overflow-y-scroll p-4">
              <h2 class="mt-2">
                Editing checklist <span class="text-secondary">{topic}</span>
              </h2>
              <section>
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">
                      What is the title of this list?
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter title"
                    class="input input-bordered w-full max-w-xs"
                    value={state.title}
                    onchange={handleChangeTitle}
                    required
                  />
                </label>
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
                            );
                          }}
                        </For>
                        <TagSelect
                          groups={state.groups}
                          onchange={handleNewItemTagChange}
                          required={item.tags.length === 0}
                        />
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
            </div>
          </div>
        </form>
      </Show>
    </Suspense>
  );
}

export { Edit };
