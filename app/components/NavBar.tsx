import { HouseIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import Show from "./utils/Show";

export default function NavBar({ email }: { email?: string }) {
  return (
    <nav className="border-b border-gray-200 shadow-sm flex justify-between p-4">
      {/* Logo */}
      <Link to="/" className="text-xl font-semibold text-gray-900 flex gap-2 items-center">
        <HouseIcon />
        IconGenerator
      </Link>

      <Show when={email !== undefined}>
        <div className="flex flex-col justify-center">
          <span>Hi {email}!</span>
        </div>
      </Show>

      <div>
        {email !== undefined ? (
          <form method="post" action="/signout">
            <button className="flex flex-col items-center gap-2">
              <LogOutIcon />
              <span className="text-xs font-bold uppercase">Sign out</span>
            </button>
          </form>
        ) : (
          <Link to="/login" className="flex flex-col items-center gap-2">
            <LogInIcon />
            <span className="text-xs font-bold uppercase">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
