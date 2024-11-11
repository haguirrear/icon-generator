import { Link } from "@remix-run/react"
import astronaut from "~/assets/astronaut.svg"
import { Button } from "~/components/ui/button"

export function ErrorPage({ status, errorCode }: { status?: number, errorCode?: string }) {
  return <main className="h-full">
    <div className="flex flex-col justify-center items-center h-full">
      <div className="grid grid-cols-2 gap-2 items-center max-w-7xl">
        <img src={astronaut} alt="Astronaut lost" />
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-9xl font-semibold ">{status || 400}</h1>
          <h2 className="text-4xl font-semibold">OH NO! Something unexpected happened.</h2>
          <p>There was an unexpected error. But you can click the button below
            to go back to the homepage.</p>
          <p className="text-muted-foreground text-sm">Error Code: {errorCode}</p>
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
