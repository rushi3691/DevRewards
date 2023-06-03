import Link from "next/link"

import { buttonVariants, Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UserRepoCard from "@/components/user-repo-card"
import { useAccount } from "wagmi"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "@/components/Global-States"
import ErrorPage from 'next/error'
import { ethers } from "ethers"
import { Icons } from "@/components/icons"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { githubData, setGithubData, isGithubConnected, setIsGithubConnected, contract } = useContext(AppContext);

  const [repos, setRepos] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(true);

  const [updatingData, setUpdatingData] = useState(false);

  const refresh_user_data = async () => {
    setUpdatingData(true);
    const userInfo = await contract.users(address);

    const data = {
      userId: userInfo.userId,
      installationId: userInfo.installationId,
      email: userInfo.email,
      name: userInfo.name,
      commitCount: userInfo.commitCount?.toString(),
      rewardsEarned: ethers.utils.formatEther(userInfo.rewardsEarned)?.toString(),
      activeRepos: userInfo.activeRepos?.toString(),
    }
    console.log("data", data);
    if (data.userId !== "") {
      setGithubData(data);
    }
    setUpdatingData(false);
  }

  
  const fetchRepo = async () => {
    const data = await contract.viewUserRepos();
    setRepos(data);
    setLoadingRepo(false);
  }
  useEffect(() => {
    if (isGithubConnected) {
      fetchRepo();
    }
  }, [isGithubConnected])




  if (!isConnected || !isGithubConnected) {
    return <ErrorPage statusCode={404} title="Try connecting your wallet and github account" />
  }

  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg sm:text-xl">
            Track your contributions, manage funds, and stay up-to-date with the latest activities in the DevRewards community
          </p>
        </div>
      </section>
      <div className="container ">
        <h1 className="text-3xl  text-right font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Profile
        </h1>
        <div className="flex space-x-2">
          {/* card for progress */}
          <Card className="w-2/3">
            <CardHeader>
              <div className="flex justify-between content-center">
                <CardTitle>Progress</CardTitle>
                {/* <Button variant="link" className="p-0 h-0" asChild> */}
                <CardDescription>
                  {updatingData?(
                    <>
                    Updating...
                    </>
                  ):(
                    <button className="hover:underline" onClick={refresh_user_data}>
                      Refresh
                    </button>
                  )}
                </CardDescription>
                {/* </Button> */}
              </div>
            </CardHeader>
            <CardContent className="flex justify-between" >
              <div>
                <p>Total Contribution</p>
                <p>{githubData.commitCount}</p>
              </div>
              <div>
                <p>My Repositories</p>
                <p>{githubData.activeRepos}</p>
              </div>
              <div>
                <p>Total Earnings</p>
                <p>{githubData.rewardsEarned} ETH</p>
              </div>
            </CardContent>
          </Card>
          {/* card for profile */}
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle>{githubData.name}</CardTitle>
              <CardDescription><Link href={`https://github.com/${githubData.name}`} target="_blank" className="hover:underline"><Icons.gitHub className="h-5 w-5" /></Link></CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between" >
              <div>
                <p>Email</p>
                <p>{githubData.email}</p>
              </div>
            </CardContent>

          </Card>
        </div>
        <h1 className="text-3xl mt-20 text-left font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Your Repositories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 items-center">
          {loadingRepo &&
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </div>}
          {repos.map((repo) => {
            if (repo.isPresent) {
              return <UserRepoCard key={repo.repoId} repo={{
                ...repo,
                balance: ethers.utils.formatEther(repo.balance),
                commits: repo.commits.toNumber(),
                rewardsGiven: ethers.utils.formatEther(repo.rewardsGiven),
              }} fetchRepo={fetchRepo} />
            }
          })}
          <Button asChild><Link className="w-full h-full" href="/dashboard/connect">List new Repo</Link></Button>
        </div>
      </div>
    </>
  )
}
