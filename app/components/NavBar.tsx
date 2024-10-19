export default function NavBar() {
  return (
    <nav className="border-b border-gray-200 shadow-sm flex justify-between p-4">
      {/* Logo */}
      <div>
        <a href="/" className="text-xl font-semibold text-gray-900">
          Logo
        </a>
      </div>

      <div>
        <a href="/login">Login Button</a>
      </div>
    </nav>
  );
}
