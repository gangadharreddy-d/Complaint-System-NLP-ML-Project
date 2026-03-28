import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 outline-none">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              EmotionAware
            </span>
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
