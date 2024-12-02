import { useParams } from "@solidjs/router";

function Edit() {
  const { topic } = useParams();

  return (
    <p class="h-screen flex items-center justify-center">Editor for {topic}</p>
  );
}

export { Edit };
