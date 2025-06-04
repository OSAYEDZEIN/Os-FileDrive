import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 relative overflow-hidden animate-fadeIn">
      {/* Decorative blurred circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400 opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-800 opacity-20 rounded-full blur-3xl z-0" />
      {/* Left Section */}
      <section className="flex-1 flex flex-col justify-center pl-12 max-w-2xl z-10">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Welcome to FileDrive!
        </h1>
        <p className="text-xl text-white/90 mb-10 max-w-xl">
          We provide reliable cloud storage for your information. Our team ensures the security and accessibility of your data at all times.
        </p>
        <div className="flex justify-start">
          <Link
            href="/dashboard/files"
            className="inline-block rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 w-auto"
          >
            Get Started
          </Link>
        </div>
      </section>
      {/* Right Section */}
      <section className="flex-1 flex justify-center items-center pr-12 z-10">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-12 flex items-center justify-center border border-white/40 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <div className="bg-white rounded-2xl w-96 h-44 flex items-center justify-center shadow-lg">
            <Image
              src="/logo.png"
              width={200}
              height={100}
              alt="file drive logo"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}