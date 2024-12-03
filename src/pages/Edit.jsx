import { createEffect, createResource } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams } from "@solidjs/router";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";

import { Tabs } from "../components/Tabs";
import { List } from "../components/List";

import { DataProvider } from "../components/DataContext";
import { StateProvider } from "../components/StateContext";

import { TagInput } from "../components/TagInput";
import { Loading } from "../components/Loading";

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
    title: "Summer reading list",
    groups: [
      {
        name: "Author",
        tags: ["Jane Austen", "Carl Sagan", "Stephen King"],
      },
      {
        name: "Genre",
        tags: ["Romance", "Fiction", "Horror", "Popular Science"],
      },
    ],
    items: [
      {
        name: "Pride and Prejudice",
        tags: ["Jane Austen", "Romance", "Fiction"],
      },
      {
        name: "Cosmos",
        tags: ["Carl Sagan", "Popular Science"],
      },
      {
        name: "The Shining",
        tags: ["Stephen King", "Fiction", "Horror"],
      },
    ],
  });

  createEffect(() => {
    if (user.data) {
      setState("uid", user.data.uid);
    }
  });

  createEffect(() => {
    if (docSnap()) {
      if (docSnap().exists()) {
        // setState("groups", undefined);
        // setState("items", undefined);
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

  const tagList = () =>
    Array.from(
      state.groups.reduce((tags, group) => {
        group.tags.forEach((tag) => {
          tags.add(tag);
        });

        return tags;
      }, new Set())
    );

  return (
    <Suspense fallback={<Loading />}>
      <Show when={docSnap()}>
        <form class="h-screen flex flex-row" onsubmit={handleSubmit}>
          <datalist id="tags">
            <For each={tagList()}>{(tag) => <option>{tag}</option>}</For>
          </datalist>
          <div class="w-1/3 content-center p-8">
            <ul class="timeline timeline-vertical">
              <li>
                <div class="timeline-start">
                  <a class="link link-hover" href="#title">
                    Set your title
                  </a>
                </div>
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="timeline-end timeline-box text-xs">
                  The title shows up at the top of the checklist
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div class="timeline-start">
                  <a class="link link-hover" href="#groups">
                    Add your groups
                  </a>
                </div>
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="timeline-end timeline-box text-xs">
                  Groups are collections of tags that are used as categories for
                  your checklist items.
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div class="timeline-start">
                  <a class="link link-hover" href="#items">
                    Add your items
                  </a>
                </div>
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="timeline-end timeline-box text-xs">
                  Items are the individual checkboxes, and can be tagged to
                  enable grouping.
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div class="timeline-start">
                  <a class="link link-hover" href="#preview">
                    Preview
                  </a>
                </div>
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="timeline-end timeline-box text-xs">
                  Preview your checklist to make sure it looks right.
                </div>
                <hr />
              </li>
              <li>
                <hr />
                <div class="timeline-start"></div>
                <div class="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="timeline-end pl-1">
                  <button class="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="flex-1 flex overflow-hidden w-2/3 max-w-full prose">
            <div class="flex-1 overflow-y-scroll p-4 gap-2">
              <h1>
                Editing checklist <span class="text-secondary">{topic}</span>
              </h1>
              <section>
                <h2 id="title" class="mt-4 mb-2">
                  Title
                </h2>
                <input
                  type="text"
                  placeholder="Enter title"
                  class="input input-bordered w-full max-w-xs"
                  value={state.title}
                  onchange={handleChangeTitle}
                  required
                />
              </section>
              <section>
                <h2 id="groups" class="mt-4 mb-2">
                  Groups
                </h2>
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

                    const handleGroupTagChange = (tags) => {
                      setGroup("tags", tags);
                    };

                    return (
                      <div class="flex flex-row gap-2">
                        <label class="form-control w-full max-w-xs">
                          <div class="label">
                            <span class="label-text">Name</span>
                          </div>
                          <input
                            class="input input-bordered"
                            type="text"
                            value={group.name}
                            onchange={handleGroupNameChange}
                            placeholder="Group name"
                          />
                        </label>
                        <label class="form-control w-full max-w-xs">
                          <div class="label">
                            <span class="label-text">Tags</span>
                          </div>
                          <div class="flex flex-col gap-2">
                            <TagInput
                              tags={group.tags}
                              onChange={handleGroupTagChange}
                            />
                          </div>
                        </label>
                      </div>
                    );
                  }}
                </For>
                <div>
                  <input
                    class="input input-bordered"
                    type="text"
                    placeholder="Add a new group"
                    onchange={handleNewGroupNameChange}
                    required={state.groups.length === 0}
                  />
                </div>
              </section>
              <section>
                <h2 id="items" class="mt-4 mb-2">
                  Items
                </h2>
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

                    const handleItemTagChange = (tags) => {
                      setItem("tags", tags);
                    };

                    return (
                      <div class="flex flex-row gap-2">
                        <label class="form-control w-full max-w-xs">
                          <div class="label">
                            <span class="label-text">Name</span>
                          </div>
                          <input
                            class="input input-bordered"
                            type="text"
                            value={item.name}
                            onchange={handleItemNameChange}
                            placeholder="Item name"
                          />
                        </label>
                        <label class="form-control w-full max-w-xs">
                          <div class="label">
                            <span class="label-text">Tags</span>
                          </div>
                          <div class="flex flex-col gap-2">
                            <TagInput
                              tags={item.tags}
                              list="tags"
                              onChange={handleItemTagChange}
                            />
                          </div>
                        </label>
                      </div>
                    );
                  }}
                </For>
                <div>
                  <input
                    class="input input-bordered"
                    type="text"
                    placeholder="Add a new item"
                    onchange={handleNewItemNameChange}
                    required={state.items.length === 0}
                  />
                </div>
              </section>
              {/* <section>
                <h2 id="preview">Preview</h2>
                <DataProvider>
                  <StateProvider>
                    <Tabs />
                    <List />
                  </StateProvider>
                </DataProvider>
              </section> */}
            </div>
          </div>
        </form>
      </Show>
    </Suspense>
  );
}

export { Edit };
