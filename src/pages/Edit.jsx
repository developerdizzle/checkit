import cc from "classcat";

import { createEffect, createResource } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams, useNavigate } from "@solidjs/router";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";

import { Header } from "../components/Header";
import { TagInput } from "../components/TagInput";
import { Loading } from "../components/Loading";
import { Preview } from "../components/Preview";
import { Instructions } from "../components/Instructions";

const DEFAULT_DATA = {
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
};

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

  const [state, setState] = createStore({ ...DEFAULT_DATA });

  const navigate = useNavigate();

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

      navigate(`/${topic}`);
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
        <Header title={state.title} />
        <main class="p-6 pt-0">
          <h1 class="text-2xl md:text-4xl text-primary font-bold">
            {state.title}
          </h1>
          <form onsubmit={handleSubmit}>
            <datalist id="tags">
              <For each={tagList()}>{(tag) => <option>{tag}</option>}</For>
            </datalist>
            <ul class="timeline timeline-snap-icon timeline-vertical">
              <li>
                {/* <div class="timeline-start !self-start mr-2">
                  Set your title
                </div> */}
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
                <div class="timeline-end">
                  <section class="m-2">
                    <input
                      type="text"
                      placeholder="Enter title"
                      class="input input-bordered w-full max-w-xs"
                      value={state.title}
                      onchange={handleChangeTitle}
                      required
                    />
                  </section>
                </div>
                <hr />
              </li>
              <li>
                <hr />
                {/* <div class="timeline-start !self-start mr-2">
                  Add your groups
                </div> */}
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
                <div class="timeline-end">
                  <section class="m-2">
                    <For each={state.groups}>
                      {(group, g) => {
                        const [, setGroup] = createStore(group);

                        const handleGroupNameChange = (e) => {
                          if (e.target.value) {
                            setGroup("name", e.target.value);
                          } else {
                            setState("groups", (gs) =>
                              gs.filter((_, i) => i !== g())
                            );
                          }
                        };

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
                </div>
                <hr />
              </li>
              <li>
                <hr />
                {/* <div class="timeline-start !self-start mr-2">
                  Add your checklist items
                </div> */}
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
                <div class="timeline-end">
                  <section class="m-2">
                    <For each={state.items}>
                      {(item, i) => {
                        const [, setItem] = createStore(item);

                        const handleItemNameChange = (e) => {
                          if (e.target.value) {
                            setItem("name", e.target.value);
                          } else {
                            setState("items", (itemState) =>
                              itemState.filter((_, idx) => idx !== i())
                            );
                          }
                        };

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
                </div>
                <hr />
              </li>
              <li>
                <hr />
                {/* <div class="timeline-start !self-start mr-2">
                  Preview your checklist
                </div> */}
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
                <div class="timeline-end">
                  <section class="m-2">
                    {" "}
                    <button
                      class="btn btn-secondary"
                      onClick="preview.showModal(); return false;"
                    >
                      Preview
                    </button>
                  </section>
                </div>
                <hr />
              </li>
              <li>
                <hr />
                {/* <div class="timeline-start !self-start mr-2">
                  Save your checklist
                </div> */}
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
                <div class="timeline-end">
                  <section class="m-2">
                    {" "}
                    <button class="btn btn-primary" type="submit">
                      Save
                    </button>
                  </section>
                </div>
              </li>
            </ul>
          </form>
        </main>
        <dialog id="preview" class="modal">
          <div class="modal-box max-w-full h-screen ">
            <Preview groups={state.groups} items={state.items} />
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </Show>
    </Suspense>
  );
}

export { Edit };
