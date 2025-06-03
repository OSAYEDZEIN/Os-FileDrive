import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          width={80}
          height={80}
          alt="file drive logo"
          className="mb-6"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Effortlessly upload, manage, and share files with your team.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8">
          Create an account and start managing your files instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/dashboard/files"
            className="inline-block rounded-lg bg-gray-900 text-white px-6 py-3 font-semibold shadow hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            Get started
          </Link>
          <a
            href="#"
            className="inline-block rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}