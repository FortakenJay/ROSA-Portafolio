import Link from "next/link";
import { DropMissing } from "@/components/drop-missing";

const lines = {
  cutesy: {
    title: "That page is not here.",
    sentence: "Nothing is waiting at this address. The rest of the house is still open.",
    home: "Home",
  },
  creepy: {
    title: "Nothing answers.",
    sentence: "This hall does not lead anywhere. Turn back while you can.",
    home: "Turn back",
  },
} as const;

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-xl px-4 py-16">
      <DropMissing />
      {(Object.keys(lines) as Array<keyof typeof lines>).map((look) => (
        <div key={look} className={look === "creepy" ? "not-found-creepy" : "not-found-cutesy"}>
          <h1 className="pb-1 font-display text-5xl leading-[1.1]">{lines[look].title}</h1>
          <p className="mt-4 max-w-md border-b-2 border-rose pb-2 font-body text-xl leading-relaxed italic">{lines[look].sentence}</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center font-body text-lg leading-none text-ink underline decoration-2 underline-offset-8 transition-colors duration-300 hover:text-rose"
          >
            {lines[look].home}
          </Link>
        </div>
      ))}
    </section>
  );
}
