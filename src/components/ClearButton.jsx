function ClearButton(props) {
  const handleClear = () => {
    if (confirm("Clear all checkboxes?")) {
      props.setState({
        progress: undefined,
        collapsed: undefined,
        selectedGroup: undefined,
      });
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
