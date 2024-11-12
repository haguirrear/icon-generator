import { Link } from "@remix-run/react"
import astronaut from "/astronaut.svg"
import { Button } from "~/components/ui/button"

export function Page404() {
  return <main className="h-full">
    <div className="flex flex-col justify-center items-center h-full">
      <div className="grid grid-cols-2 gap-2 items-center max-w-7xl">
        <img src={astronaut} alt="Astronaut lost" />
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-9xl font-semibold ">404</h1>
          <h2 className="text-4xl font-semibold">UH OH! You're lost.</h2>
          <p>The page you are looking for does not exist.
            How you got here is a mystery. But you can click the button below
            to go back to the homepage.
          </p>
          <Button asChild>
            <Link to="/">
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </main>
}
