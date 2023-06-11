import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PublicRepoCard, PublicRepos } from "@/components/public-repo-card"
import { useRouter } from "next/router"
import { useAccount } from "wagmi"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "@/components/Global-States"
import { ethers } from "ethers"
import InstallationWait from "@/components/installation-loading-dialog"
import { InfoCard } from "@/components/home-card-deck"


const info_card_data = [
  {
    "title": "Connect and Collaborate",
    "points": [
      "Seamlessly link your wallet and GitHub account to unlock a world of collaboration and funding.",
      "Discover exciting open-source projects and contribute your skills to make a real impact."
    ]
  },
  {
    "title": "List Your Repositories",
    "points": [
      "Showcase your projects and set an initial fund to attract contributors.",
      "Define rewards and incentives to encourage collaboration and innovative contributions."
    ]
  },
  {
    "title": "Fund and Contribute",
    "points": [
      "Browse through listed repositories and find projects that align with your interests and expertise.",
      "Contribute your skills, knowledge, and financial support to help bring these projects to life."
    ]
  },
  {
    "title": "Earn Rewards",
    "points": [
      "Receive rewards for your contributions based on the rules set by repository owners.",
      "Climb up the leaderboard and gain recognition within the community."
    ]
  },
  {
    "title": "Transparent Transactions",
    "points": [
      "Manage your funds securely with blockchain technology.",
      "Track and verify all transactions for complete transparency and accountability."
    ]
  },
  {
    "title": "Community-driven Platform",
    "points": [
      "Engage with a vibrant community of developers and funders who share your passion for coding.",
      "Network, collaborate, and learn from like-minded individuals to foster growth and innovation."
    ]
  }
]



export default function IndexPage() {
  const router = useRouter();
  const { query } = router;
  const { address } = useAccount();
  const { setIsGithubConnected, setGithubData, contract, isGithubConnected } = useContext(AppContext)
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const { installation_id, code } = query;
    // console.log(installation_id, code);
    if (installation_id && code) {
      const registerInstallation = async () => {
        setRegLoading(true);
        // console.log(installation_id)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check_installation?id=${installation_id}&address=${address}&code=${code}`);
        if(res.status !== 200) {
          setRegLoading(false);
          return;
        }
        const data = await res.json();
        // console.log(data);
        if (data.name) {
          setIsGithubConnected(true);
          setGithubData(data);
          setRegLoading(false);
          router.push({ pathname: '/' }); // redirect to home page
        }
      }
      registerInstallation();
    }
  }, [query])

  if (regLoading) {
    return (
      <InstallationWait open={regLoading} setOpen={setRegLoading} />
    )
  }


  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            DevRewards <br className="hidden sm:inline" />
          </h1>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-2xl lg:text-3xl">
            Empowering Collaboration between Developers and Funders
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg sm:text-xl">
            Welcome to DevRewards, the platform that bridges the gap between developers and funders, revolutionizing the world of coding collaboration and financial opportunities. Connect your Wallet and GitHub Account to unlock a wealth of possibilities.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://github.com/rushi3691/DevRewards/"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            Github
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Demo
          </Link>
        </div>
        <h1 className="text-center mt-20 text-2xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-2xl lg:text-3xl">
          Key Highlights
        </h1>

        <div className="container grid grid-cols-3 gap-3 w-[90%]">

          {info_card_data.map((info, index) => {
            return <InfoCard key={index} title={info.title} points={info.points} />
          })}
        </div>

        <h1 className="text-3xl mt-20 font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          <div className="">
            Accelerate you Coding Journey with us <br className="hidden sm:inline" />
          </div>
          Connect your Wallet, Sign up with Github <br className="hidden sm:inline" />
          and Check out the Awesome Repos!
        </h1>
      </section>
    </>
  )
}
