import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 py-6 border-t border-white/10">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex flex-wrap justify-center gap-6 bg-white/5 backdrop-blur-sm rounded-full px-6 py-2">
          <Link className="text-white/80 hover:text-cyan-400 font-medium transition-colors text-sm" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-white/80 hover:text-cyan-400 font-medium transition-colors text-sm" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-white/80 hover:text-cyan-400 font-medium transition-colors text-sm" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}