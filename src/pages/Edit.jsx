import { createEffect, createResource } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams, useNavigate } from "@solidjs/router";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useFirebaseApp, useAuth } from "solid-firebase";
import { getAuth } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

import { Header } from "../components/Header";
import { TagInput } from "../components/TagInput";
import { Loading } from "../components/Loading";
import { Preview } from "../components/Preview";

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

  const analytics = getAnalytics();

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

  createEffect(() => {
    window.exportJSON = () => {
      const exportedState = { ...unwrap(state) };
      delete exportedState.uid;
      return exportedState;
    };
  });

  const handleChangeTitle = (e) => {
    setState("title", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setDoc(doc(db, "topics", topic), unwrap(state));

      logEvent(analytics, "topic_saved", {
        topic,
      });

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
    e.preventDefault();

    setState("items", state.items.length, {
      name: e.target.value,
      description: "",
      tags: [],
    });

    e.target.value = "";

    return false;
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

  const preventEnterSubmit = (e) => {
    if (e.which == 13) return false;
  };

  const groupsLength = () => state.groups.length;
  const itemsLength = () => state.items.length;

  const moveGroup = (from, to) => {
    console.log("moveGroup", from, to);
    const updated = state.groups.slice();

    updated.splice(to, 0, ...updated.splice(from, 1));

    setState("groups", updated);
  };

  const moveItem = (from, to) => {
    console.log("moveItem", from, to);
    const updated = state.items.slice();

    updated.splice(to, 0, ...updated.splice(from, 1));

    setState("items", updated);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Show when={docSnap()}>
        <Header title={state.title} />
        <main class="p-6 pt-0">
          <h1 class="text-2xl md:text-4xl text-primary font-bold">
            {state.title}
          </h1>
          <form onkeydown={preventEnterSubmit} onsubmit={handleSubmit}>
            <datalist id="tags">
              <For each={tagList()}>{(tag) => <option>{tag}</option>}</For>
            </datalist>
            <ul class="timeline timeline-snap-icon timeline-vertical">
              <li>
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
                <div class="timeline-end w-full">
                  <section class="m-2 mt-0 flex flex-col gap-2">
                    <h2 class="text-xl font-bold">Set your title</h2>
                    <p class="text-sm">
                      This will appear at the top of your checklist.
                    </p>
                    <input
                      type="text"
                      placeholder="Enter title"
                      class="input input-bordered w-full m:max-w-xs"
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
                <div class="timeline-end w-full">
                  <section class="m-2 mt-0 flex flex-col gap-2">
                    <h2 class="text-xl font-bold">Add groups</h2>
                    <p class="text-sm">
                      A group is a type of category, such as{" "}
                      <strong>Author</strong> or <strong>Genre</strong>. Each
                      group contains a set of tags that describe a single
                      category of items, such as <strong>Stephen King</strong>{" "}
                      or <strong>Fiction</strong>. These tags will be added to
                      checklist items so that they can be grouped.
                    </p>
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

                        const handleMoveUp = (e) => {
                          e.preventDefault();
                          console.log("move up");
                          moveGroup(g(), g() - 1);
                        };
                        const handleMoveDown = (e) => {
                          e.preventDefault();
                          console.log("move down");
                          moveGroup(g(), g() + 1);
                        };

                        return (
                          <div class="flex flex-col md:flex-row gap-2 rounded-box bg-base-200 p-2">
                            <div class="flex flex-row md:flex-col gap-2">
                              <Show when={g() > 0}>
                                <button
                                  class="btn btn-sm btn-ghost btn-circle"
                                  onclick={handleMoveUp}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="size-5"
                                    viewBox="0 -960 960 960"
                                    fill="currentColor"
                                  >
                                    <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
                                  </svg>
                                </button>
                              </Show>
                              <Show when={g() + 1 < groupsLength()}>
                                <button
                                  class="btn btn-sm btn-ghost btn-circle"
                                  onclick={handleMoveDown}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="size-5"
                                    viewBox="0 -960 960 960"
                                    fill="currentColor"
                                  >
                                    <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
                                  </svg>
                                </button>
                              </Show>
                            </div>
                            <input
                              class="input input-bordered md:flex-1"
                              type="text"
                              value={group.name}
                              onchange={handleGroupNameChange}
                              placeholder="Group name"
                            />
                            <div class="flex flex-col md:flex-1 gap-2">
                              <TagInput
                                tags={group.tags}
                                onChange={handleGroupTagChange}
                              />
                            </div>
                          </div>
                        );
                      }}
                    </For>
                    <input
                      class="input input-bordered"
                      type="text"
                      placeholder="Add a new group"
                      onchange={handleNewGroupNameChange}
                      required={state.groups.length === 0}
                    />
                  </section>
                </div>
                <hr />
              </li>
              <li>
                <hr />
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
                <div class="timeline-end w-full">
                  <section class="m-2 mt-0 flex flex-col gap-2">
                    <h2 class="text-xl font-bold">Add checklist items</h2>
                    <p class="text-sm">
                      Each item is a single checkbox. Tagged items will show up
                      under the corresponding group(s).
                    </p>
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

                        const handleItemDescriptionChange = (e) => {
                          setItem("description", e.target.value || undefined);
                        };

                        const handleItemTagChange = (tags) => {
                          setItem("tags", tags);
                        };

                        const handleMoveUp = (e) => {
                          e.preventDefault();
                          console.log("move up");
                          moveItem(i(), i() - 1);
                        };
                        const handleMoveDown = (e) => {
                          e.preventDefault();
                          console.log("move down");
                          moveItem(i(), i() + 1);
                        };

                        return (
                          <div class="flex flex-col md:flex-row gap-2 rounded-box bg-base-200 p-2">
                            <div class="flex flex-row md:flex-col gap-2">
                              <Show when={i() > 0}>
                                <button
                                  class="btn btn-sm btn-ghost btn-circle"
                                  onclick={handleMoveUp}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="size-5"
                                    viewBox="0 -960 960 960"
                                    fill="currentColor"
                                  >
                                    <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
                                  </svg>
                                </button>
                              </Show>
                              <Show when={i() + 1 < itemsLength()}>
                                <button
                                  class="btn btn-sm btn-ghost btn-circle"
                                  onclick={handleMoveDown}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="size-5"
                                    viewBox="0 -960 960 960"
                                    fill="currentColor"
                                  >
                                    <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
                                  </svg>
                                </button>
                              </Show>
                            </div>
                            <div class="flex flex-col md:flex-1 gap-2">
                              <div class="flex flex-col gap-2">
                                <input
                                  class="input input-bordered"
                                  type="text"
                                  value={item.name}
                                  onchange={handleItemNameChange}
                                  placeholder="Item name"
                                />
                                <input
                                  class="input input-bordered input-sm"
                                  type="text"
                                  value={item.description || ""}
                                  onchange={handleItemDescriptionChange}
                                  placeholder="Item description (optional)"
                                />
                              </div>
                            </div>
                            <div class="flex flex-col md:flex-1 gap-2">
                              <TagInput
                                tags={item.tags}
                                list="tags"
                                onChange={handleItemTagChange}
                              />
                            </div>
                          </div>
                        );
                      }}
                    </For>
                    <input
                      class="input input-bordered"
                      type="text"
                      placeholder="Add a new item"
                      onchange={handleNewItemNameChange}
                      required={state.items.length === 0}
                    />
                  </section>
                </div>
                <hr />
              </li>
              <li>
                <hr />
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
                <div class="timeline-end w-full">
                  <section class="m-2">
                    <button
                      type="button"
                      class="btn btn-secondary w-full md:w-auto"
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
                <div class="timeline-end w-full">
                  <section class="m-2">
                    <button
                      class="btn btn-primary w-full md:w-auto"
                      type="submit"
                    >
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
