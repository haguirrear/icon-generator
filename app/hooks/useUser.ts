import { useQuery } from "@tanstack/react-query";

export type UserData = {
  loggedIn: boolean;
  email: string;
};

async function fetchUserData(): Promise<UserData> {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

export function useUser() {
  return useQuery<UserData>({
    queryKey: ["user"],
    queryFn: fetchUserData,
  });
}
