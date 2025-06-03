import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 mt-16">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
        <div className="font-semibold text-gray-700">FileDrive</div>
        <div className="flex gap-4">
          <Link className="hover:text-gray-900 transition-colors" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-gray-900 transition-colors" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="hover:text-gray-900 transition-colors" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}