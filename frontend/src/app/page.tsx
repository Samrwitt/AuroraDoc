import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="mt-2">Jump to your documents.</p>
      <Link href="/projects" className="underline text-blue-600 mt-4 inline-block">
        Go to Projects
      </Link>
    </main>
  );
}
