import { HouseIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import Show from "./utils/Show";

export default function NavBar({ email, credits }: { email?: string, credits?: number }) {
  const cred = credits || 0
  return (
    <nav className="border-b border-border shadow-sm flex justify-between p-4">
      {/* Logo */}
      <Link to="/" className="text-xl font-semibold flex gap-2 items-center">
        <HouseIcon />
        IconGenerator
      </Link>

      <div>
        {email &&
          <div className="flex flex-col justify-center items-end gap-2">
            <Link to="/profile" className="font-semibold hover:text-muted">{email}</Link>
            <div className="flex gap-2 items-center justify-end w-full">

              <div className="rounded-xl bg-primary text-primary-foreground px-2 py-1 text-sm">{cred} credit{cred > 1 || cred === 0 ? "s" : ""}</div>
              <form method="post" action="/signout" title="Sign out" className="w-5 h-5">
                <button type="submit">
                  <LogOutIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        }

        <Show when={email === undefined}>
          <Link to="/login" className="flex flex-col items-center gap-2">
            <LogInIcon />
            <span className="text-xs font-bold uppercase">Login</span>
          </Link>
        </Show>
      </div>
    </nav >
  );
}
