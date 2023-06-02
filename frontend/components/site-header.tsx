import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import ConnectBtn from "./connect-btn"
import { useContext } from "react"
import { AppContext } from "./Global-States"
import { useAccount } from "wagmi"

export function SiteHeader() {
  const { isConnected } = useAccount();
  const { githubData, setGithubData, isGithubConnected, setIsGithubConnected, contract } = useContext(AppContext);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ConnectBtn />
            {isConnected ? (
              <>
                {!isGithubConnected ? (
                  <Link
                    href="https://github.com/apps/rushwebhooktest1/installations/new"
                    className={buttonVariants({ variant: "outline" })}>
                    Connect Github
                  </Link>
                ) :
                  <>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </>
                }
              </>
            ) : <></>}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
