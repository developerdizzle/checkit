import { useParams } from "@solidjs/router";

function Edit() {
  const { topic } = useParams();

  return (
    <div class="h-screen flex items-center justify-center">
      <p>
        Editor for&nbsp;<span class="text-secondary">{topic}</span>
      </p>
    </div>
  );
}

export { Edit };
