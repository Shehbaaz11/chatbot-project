import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to MedBot</h1>
      <p>Click below to start chatting:</p>
      <Link href="/chat">
        <button>Start Chat</button>
      </Link>
    </div>
  );
}
