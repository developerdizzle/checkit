function ProgressBar(props) {
  const itemsLength = () => props.items.length;

  const itemsCompleted = () => props.checkedItems?.length || 0;
  const percentage = () => (itemsCompleted() * 100) / itemsLength();

  return (
    <>
      <progress
        title={`${itemsCompleted()}/${itemsLength()}`}
        class="progress progress-info"
        value={percentage()}
        max="100"
      />
      <span class="text-xs">
        {itemsCompleted()}/{itemsLength()}
      </span>
    </>
  );
}

export { ProgressBar };
