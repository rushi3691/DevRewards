import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import Link from "next/link"
import FundDialog from "./fund-dialog"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "./Global-States"
import { ethers } from "ethers"


export function PublicRepoCard({ repo, fetchRepo }) {
  const [openFundModal, setOpenFundModal] = useState(false)
  const { isGithubConnected, contract } = useContext(AppContext);
  const [labels, setLabels] = useState([]);
  const [isValid, setIsValid] = useState([]);
  const [labelPrice, setLabelPrice] = useState([]);

  const [loadingLables, setLoadingLabels] = useState(false);

  const fetchLabels = async () => {
    setLoadingLabels(true);
    const data = await contract.viewLabels(repo.repoId);
    setLabels(data.labelName);
    setIsValid(data.isValid);
    setLabelPrice(data.prize);
    setLoadingLabels(false);
  }
  useEffect(() => {
    fetchLabels();
  }, [repo])

  return (
    <>
      <Card >
        <CardHeader>
          <CardTitle>{repo.name}</CardTitle>
          <CardDescription><Link href={repo.url} target="_blank" className="hover:underline">visit</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex justify-between">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Total Funds Availble</Label>
                  <p id="name" className="text-base">{repo.balance} ETH</p>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="contributions">Total Rewards Given</Label>
                  <p id="contributions" className="text-base">{repo.rewardsGiven} ETH</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Total Contributions</Label>
                  <p id="name" className="text-base">{repo.commits}</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4">
                  Check out Rewards
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="grid gap-4">
                    {loadingLables ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        {isValid.map((valid, index) => {
                          if (valid) {
                            return (
                              <div key={index}>
                                <div className="flex justify-between items-center">
                                  <Label >{labels[index]}</Label>
                                  <p id="l1eth">{ethers.utils.formatEther(labelPrice[index])} ETH</p>
                                </div>
                                <Separator className="my-1" />
                              </div>
                            )
                          }
                        })}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-start space-x-2">
          <Button onClick={e => setOpenFundModal(true)}>Fund</Button>
          <Label> Wanna Contribute?</Label>
        </CardFooter>
      </Card>
      <FundDialog open={openFundModal} setOpen={setOpenFundModal} repoId={repo.repoId} repoName={repo.name} fetchRepo={fetchRepo} balance={repo.balance} />
    </>
  )
}
