import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-transparent py-6 shadow-inner border-t border-white/10">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 px-4">
        <div className="flex flex-wrap justify-center gap-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm">
          <Link className="text-white/90 hover:text-white font-medium transition-colors" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-white/90 hover:text-white font-medium transition-colors" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-white/90 hover:text-white font-medium transition-colors" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}