import "dotenv/config";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./theme/mode-toggle";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Header = () => {
  const { data: session, isPending, error } = authClient.useSession();
  const logoTitle = "<Type racer />";
  const router = useRouter();

  return (
    <div className="logo flex justify-between">
      <div className="flex flex-col ">
        <p className="font-semibold text-2xl dark:text-gray-200">{`${logoTitle}`}</p>
        <p className="dark:text-gray-400 text-gray-600 text-xs">
          Test your typing speed and accuracy
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* 1) if error then show error in Profile */}
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        )}
        {/* 2) if isPending is true then show loading in Profile */}
        {isPending && (
          <div className="flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
        {/* 3) if session is null then show login button in Profile */}
        {!session && !isPending && !error && (
          <Button
            className="rounded-md bg-primary"
            onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
        )}
        {/* 4) if session is not null then show profile image in Profile */}
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 cursor-pointer rounded-full">
              {session?.user?.image ? (
                <Avatar>
                  <AvatarImage
                    src={session.user.image}
                    referrerPolicy="no-referrer"
                    alt={session.user.name}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-700">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              <DropdownMenuItem
                className="dark:focus:bg-gray-600 focus:bg-gray-100"
                onClick={() => router.push("/profile/" + session.user.id)}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="dark:focus:bg-gray-600 focus:bg-gray-100">
                {session.user.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                className="dark:focus:bg-gray-600 focus:bg-gray-100 justify-between"
                onClick={async () => {
                  try {
                    await authClient.signOut();
                  toast.success("Logged out successfully", {
                    description: "See you again soon!",
                    duration: 2000,
                  });
                  } catch (error) {
                    console.error("Error signing out:", error);
                    toast.error("Error signing out", {
                      description: "Please try again later.",
                      duration: 2000,
                    });
                  }
                }}
              >
                Log out{" "}
                <span>
                  {" "}
                  <LogOut height={20} />
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* light/dark theme button */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
