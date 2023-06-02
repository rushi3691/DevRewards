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
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";

export default function AddLabelDialog({ open, setOpen, repoId, repoName, refreshLabels }) {
  const [labelName, setLabelName] = useState('');
  const [reward, setReward] = useState('');
  const [loading, setLoading] = useState(false);
  const { contract } = useContext(AppContext);
  const { toast } = useToast()

  const addLabel = async () => {
    setLoading(true);
    try {
      const data = await contract.addLabels(
        repoId,
        labelName,
        ethers.utils.parseEther(reward)
      );
      await data.wait();
      // added label successfully
      toast({
        title: "Label Added",
        description: `Label ${labelName} added successfully`,
      })
      refreshLabels();
    } catch (e) {
      console.log(e);
      toast({
        title: "Failed to add label",
        description: `Error adding label ${labelName}`,
      })
    }
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()} className="w-3/4">
        <DialogHeader>
          <DialogTitle>Add Label</DialogTitle>
          <DialogDescription>
            for {repoName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-label" className="text-right">
              Label
            </Label>
            <Input id="new-label" placeholder="Lable" value={labelName} onChange={e => setLabelName(e.target.value)} className="col-span-3" disabled={loading} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reward-new-label" className="text-right">
              Reward Value
            </Label>
            <Input id="reward-new-label" placeholder="ETH" value={reward} onChange={e => setReward(e.target.value)} className="col-span-3" disabled={loading} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addLabel} disabled={loading}>
          {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Adding</span>
              </>
            ) : (
              <>
                Add Label
              </>
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

