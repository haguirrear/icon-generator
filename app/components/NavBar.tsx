import { HouseIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Link } from "@remix-run/react";
import Show from "./utils/Show";
import { Button } from "./ui/button";
import { useUser } from "~/hooks/useUser";
import { isServer } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function NavBar({ email, credits }: { email?: string, credits?: number }) {
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

// Colors 
// Background from bars: #1F2228 (accent)

export default function NewNavBar(props: unknown) {
  const { data, isLoading, isError } = useUser();

  return (
    <nav className="max-w-screen-xl  mx-auto my-4 rounded-xl bg-accent flex justify-between items-center">
      <div className="p-2">
        <img src="circle.svg" alt="circle logo" />
      </div>

      {isLoading || isError || !data?.loggedIn ? (
        <Link to="/login" className="p-2">
          <Button className="bg-secondary">Login</Button>
        </Link>
      ) : (
        <div className="flex items-center gap-2 p-2">
          <div className="flex gap-2 items-center justify-end w-full">
            <form method="post" action="/signout" title="Sign out">
              <Button className="bg-secondary" type="submit">Sign out</Button>
            </form>
          </div>

          <Link to="/profile" className="font-semibold">
            <Avatar>
              <AvatarFallback>{data.email.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        </div>

      )}
    </nav>
  )
}
