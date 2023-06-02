import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext, useState } from "react";
import { AppContext } from "./Global-States";
import { ethers } from "ethers";
import { Loader2, X } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function FundDialog({ open, setOpen, repoId, repoName, fetchRepo, balance }) {
  const { toast } = useToast()
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { contract } = useContext(AppContext);


  const fund = async () => {
    setLoading(true);
    try {
      const data = await contract.fundProject(
        ethers.utils.parseEther(amount),
        repoId,
        {
          value: ethers.utils.parseEther(amount)
        }
      );
      await data.wait();
      toast({
        title: "Funded!",
        description: <>
        You have successfully funded {repoName} with <div>{amount} ETH</div></>
      })
      fetchRepo();
    } catch (e) {
      console.log(e);
      toast({
        title: "Error!",
        description: `There was an error while funding ${repoName}`,
        variant: "destructive"
      })

    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()} className="w-1/2">
        <DialogHeader>
          <DialogTitle>{repoName}</DialogTitle>
          <DialogDescription>
            Balance {balance} ETH
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Label htmlFor="amount-edit-label" >
            Amount
          </Label>
          <div className="">
            <Input id="amount-edit-label" placeholder="ETH" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" disabled={loading} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={fund} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Processing</span>
              </>
            ) : (
              <>Fund!</>
            )}
          </Button>
        </DialogFooter>
        {!loading && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>

  )
}

