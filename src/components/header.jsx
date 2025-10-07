export default function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-[60px] px-6">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold tracking-wide hover:text-gray-200 transition-colors duration-300 cursor-pointer">
          My Store
        </h1>

        {/* Navigation Links (example) */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-gray-200 transition-colors duration-300">
            Home
          </a>
          <a href="#" className="hover:text-gray-200 transition-colors duration-300">
            Products
          </a>
          <a href="#" className="hover:text-gray-200 transition-colors duration-300">
            About
          </a>
          <a href="#" className="hover:text-gray-200 transition-colors duration-300">
            Contact
          </a>
        </nav>

        {/* Button */}
        <button className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-100 transition duration-300">
          Sign In
        </button>
      </div>
    </header>
  );
}
