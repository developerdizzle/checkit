import { useParams } from "@solidjs/router";

function ClaimTopic() {
  const { topic } = useParams();

  return (
    <div class="h-screen flex items-center justify-center">
      <p>
        No checklist has been made for{" "}
        <span class="text-secondary">{topic}</span>. Would you like to{" "}
        <a class="link link-primary" href={`${topic}/edit`}>
          create one?
        </a>
      </p>
    </div>
  );
}

export { ClaimTopic };
