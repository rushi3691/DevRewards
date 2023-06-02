import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  GithubIcon,
  Loader2
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi"
import { AppContext } from "@/components/Global-States"
import ErrorPage from 'next/error'
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"


export default function ConnectRepo() {
  const [isForm, setIsForm] = useState(false);
  const { isConnected } = useAccount();
  const { githubData, setGithubData, isGithubConnected, setIsGithubConnected, contract } = useContext(AppContext);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repos, setRepos] = useState([]);
  const [formRepo, setFormRepo] = useState(null);
  const { toast } = useToast()

  const [loading, setLoading] = useState(false);


  const [initialFunds, setInitialFunds] = useState("");
  const [defaultReward, setDefaultReward] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_repos?id=${githubData.installationId}&name=${githubData.name}`)
      if(res.status !== 200) {
        setLoadingRepos(false);
        return;
      }
      const data = await res.json();
      setRepos(data);
      setLoadingRepos(false);
    }
    if (isGithubConnected) {
      fetchRepo();
    }
  }, [isGithubConnected])

  if (!isConnected || !isGithubConnected) {
    return <ErrorPage statusCode={404} title="Try connecting your wallet and github account" />
  }

 
  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await contract.addRepo(
        formRepo.name,
        githubData.email,
        formRepo.id.toString(),
        formRepo.url,
        ethers.utils.parseEther(initialFunds),
        ethers.utils.parseEther(defaultReward),
        {
          value: ethers.utils.parseEther(initialFunds)
        }
      )
      await result.wait();

      setInitialFunds("");
      setDefaultReward("");
      setIsForm(false);
      toast({
        title: "Repository Listed!",
        description: `${formRepo.name} has been listed successfully.`,
      })
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }



  return (
    <div className="container">
      <h1 className="text-3xl my-5 font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
        Connect your Repository
      </h1>
      <div className="flex justify-between">
        <Command className="rounded-lg border shadow-md w-[40%] mb-4">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Repositories">
              {/* <ScrollArea className="h-max"> */}
              {loadingRepos ? (
                <div ClassName="flex items-center justify-center">
                  <div ClassName="text-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </div>
                </div>
              ) : (
                <>
                  {repos.map((repo) => (
                    <CommandItem key={repo.id} className="flex justify-between">
                      <div className="flex items-center">
                        <GithubIcon className="mr-4 h-4 w-4" />
                        <span>{repo.name}</span>
                      </div>
                      <Button onClick={e => {
                        setIsForm(true);
                        setFormRepo(repo);
                      }} className="ml-4" variant="" size="sm" disabled={loading}> Connect </Button>

                    </CommandItem>
                  ))}
                </>
              )}

            </CommandGroup>
          </CommandList>
        </Command>
        {isForm && (
          <Card className="w-[30%] h-[40%] my-32 mx-32">
            <CardHeader>
              <CardTitle>{formRepo.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="funds">Initial Funds</Label>
                    <Input id="funds" placeholder="ETH" value={initialFunds} onChange={e => setInitialFunds(e.target.value)} disabled={loading} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="reward">Default Reward</Label>
                    <Input id="reward" placeholder="ETH" value={defaultReward} onChange={e => setDefaultReward(e.target.value)} disabled={loading} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span>Listing</span>
                  </>
                ) : (
                  <>List it!</>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
