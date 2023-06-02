
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
import EditLabelDialog from "./edit-label-dialog"
import { useContext, useEffect, useState } from "react"
import AddLabelDialog from "./add-label-dialog"
import WithdrawDialog from "./withdraw-modal"
import { ethers } from "ethers"
import { AppContext } from "./Global-States"
import FundDialog from "./fund-dialog"
import Link from "next/link"
import { Trash } from "lucide-react"
import DeleteRepoDialog from "./delete-repo-dialog"




export default function UserRepoCard({ repo, fetchRepo }) {
  const [openEditLabelModal, setOpenEditLabelModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedLabelPrize, setSelectedLabelPrize] = useState("");

  const [openFundModal, setOpenFundModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddLabelModal, setOpenAddLabelModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const { isGithubConnected, contract } = useContext(AppContext);
  const [labels, setLabels] = useState([]);
  const [isValid, setIsValid] = useState([]);
  const [labelPrice, setLabelPrice] = useState([]);

  const [loadingLables, setLoadingLabels] = useState(false);

  const fetchLabels = async () => {
    setLoadingLabels(true);
    const data = await contract.viewLabels(repo.repoId);
    setLabels([...data.labelName]);
    setIsValid([...data.isValid]);
    setLabelPrice([...data.prize]);
    setLoadingLabels(false);
  }

  useEffect(() => {
    if (isGithubConnected) {
      fetchLabels();
    }
  }, [isGithubConnected])

  return (
    <>
      <Card >
        <CardHeader>
          <CardTitle>{repo.name}</CardTitle>
          <CardDescription><Link href={repo.url} target="_blank" className="hover:underline">visit</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-full items-center gap-4">
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Balance</Label>
                <p>{repo.balance} ETH</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Contributions</Label>
                <p>{repo.commits}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4">
              <Button variant="secondary" onClick={e => setOpenFundModal(true)}>Fund</Button>
              <Button variant="secondary" onClick={e => setOpenWithdrawModal(true)}>Withdraw</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-4 w-full items-center gap-4">
            <div className="col-span-2 flex space-y-1.5">
              <Popover>
                <PopoverTrigger className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                  Add/Edit Labels
                </PopoverTrigger>
                <PopoverContent className="w-80">
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
                                  <Label>{labels[index]}</Label>
                                  <p>{ethers.utils.formatEther(labelPrice[index])} ETH</p>
                                  <Button onClick={e => { setOpenEditLabelModal(true); setSelectedLabel(labels[index]); setSelectedLabelPrize(ethers.utils.formatEther(labelPrice[index])) }}>Edit</Button>
                                </div>
                                <Separator />
                              </div>
                            )
                          }
                        })}
                      </>
                    )}

                    <Button onClick={e => setOpenAddLabelModal(true)}>Add Label</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-1"></div>
            <Button variant="ghost" className="col-span-1" onClick={e => setOpenDeleteModal(true)}>
              <Trash size={20} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <EditLabelDialog open={openEditLabelModal} setOpen={setOpenEditLabelModal} repoId={repo.repoId} repoName={repo.name} refreshLabels={fetchLabels} label={selectedLabel} labelPrice={selectedLabelPrize} />
      <AddLabelDialog open={openAddLabelModal} setOpen={setOpenAddLabelModal} repoId={repo.repoId} repoName={repo.name} refreshLabels={fetchLabels} />
      <WithdrawDialog open={openWithdrawModal} setOpen={setOpenWithdrawModal} repoId={repo.repoId} repoName={repo.name} fetchRepo={fetchRepo} balance={repo.balance} />
      <FundDialog open={openFundModal} setOpen={setOpenFundModal} repoId={repo.repoId} repoName={repo.name} fetchRepo={fetchRepo} balance={repo.balance} />
      <DeleteRepoDialog
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        repoId={repo.repoId} repoName={repo.name} fetchRepo={fetchRepo} />
      
    </>
  )
}
