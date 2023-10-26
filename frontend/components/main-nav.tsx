import * as React from "react";
import Link from "next/link";
import { PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useAccount } from "wagmi";



import { NavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";



import { AppContext } from "./Global-States";


interface MainNavProps {
  items?: NavItem[]
}

export function MainNav() {
  const { isConnected, connector} = useAccount();
  const { isGithubConnected } = React.useContext(AppContext)
  const { toast } = useToast()

  React.useEffect(()=>{
    async function listenForEvents(){
      if(!connector) return;
      const provider = await connector.getProvider();
      const providerEther = new ethers.providers.Web3Provider(provider);
      const signer = providerEther.getSigner();
      // @ts-ignore
      const user = await PushAPI.initialize(signer, { env: "staging" })

      // To listen to real time notifications
      user.stream.on("STREAM.NOTIF", (data) => {
        // console.log(data)
        toast({
          title: data.message.notification.title,
          description: data.message.notification.body,
        })
      })

      console.log("initialized")
    }
    if(isGithubConnected){
      listenForEvents();
    }
  }, [isGithubConnected])

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        <span className="hidden font-bold sm:inline-block">
          DevRewards
        </span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        <Link
          key='1'
          href='/'
          className={cn(
            "text-muted-foreground flex items-center text-lg font-semibold sm:text-sm",
            "opacity-80"
          )}
        >
          Home
        </Link>
        {isConnected && (
          <Link
            key='2'
            href='/catalogue'
            className={cn(
              "text-muted-foreground flex items-center text-lg font-semibold sm:text-sm",
              "opacity-80"
            )}
          >
            catalogue
          </Link>
        )}
        {isConnected && isGithubConnected && (
          <>
            <Link
              key='3'
              href='/logs'
              className={cn(
                "text-muted-foreground flex items-center text-lg font-semibold sm:text-sm",
                "opacity-80"
              )}
            >
              Logs
            </Link>
            <Link
              key='4'
              href='/dashboard'
              className={cn(
                "text-muted-foreground flex items-center text-lg font-semibold sm:text-sm",
                "opacity-80"
              )}
            >
              Dashboard
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}