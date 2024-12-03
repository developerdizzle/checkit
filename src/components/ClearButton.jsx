import { useState } from "./StateContext";

function ClearButton() {
  const [state, setState] = useState();

  const handleClear = () => {
    if (confirm("Clear all checkboxes?")) {
      setState({ progress: undefined, collapsed: undefined });
    }
  };

  return (
    <p class="text-center mt-8">
      <button
        class="btn btn-secondary btn-outline btn-wide"
        onclick={handleClear}
      >
        Clear
      </button>
    </p>
  );
}

export { ClearButton };
