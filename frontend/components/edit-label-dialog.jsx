import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
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
import { DialogClose } from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast";

export default function EditLabelDialog({ open, setOpen, repoId, repoName, refreshLabels, label, labelPrice }) {
  const [reward, setReward] = useState("");
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { contract } = useContext(AppContext);
  const { toast } = useToast()
  
  const deleteLabel = async () => {
    setLoading(true);
    setDeleteLoading(true);
    try {
      const data = await contract.deleteLabel(repoId, label);
      await data.wait();
      toast({
        title: "Label Deleted",
        description: `Label ${label} deleted successfully`,
      })
      refreshLabels();
    } catch (e) {
      console.log(e);
      toast({
        title: "Failed to delete label",
        description: `error: ${e.message}`,
        variant: "destructive"
      })
    }
    setLoading(false);
    setDeleteLoading(false);
    setOpen(false);
  }
  
  
  const editLabel = async () => {
    setLoading(true);
    setEditLoading(true);
    try {
      const data = await contract.editLabel(repoId, label, ethers.utils.parseEther(reward));
      await data.wait();
      toast({
        title: "Label Edited",
        description: `Label ${label} edited successfully`,
      })
      refreshLabels();
    } catch (e) {
      console.log(e);
      toast({
        title: "Failed to edit label",
        description: `error: ${e.message}`,
        variant: "destructive"
      })
    }
    setLoading(false);
    setEditLoading(false);
    setOpen(false);
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()} className="w-3/4">
        <DialogHeader>
          <DialogTitle>Edit Label</DialogTitle>
          <DialogDescription>
            for {repoName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-label" className="text-right">
              Label
            </Label>
            <Input id="edit-label" value={label} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reward-edit-label" className="text-right">
              Reward
            </Label>
            <Input id="reward-edit-label" placeholder={labelPrice + " ETH"} value={reward} onChange={e => setReward(e.target.value)} className="col-span-3" disabled={loading} />
          </div>
        </div>
        <div className="flex flex-row-reverse justify-between">
          {/* <div> */}
          <Button type="submit" onClick={editLabel} disabled={loading}>
            {editLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Saving</span>
              </>
            ) : (
              <>Save changes</>
            )}
          </Button>
          {label !== "default" && (
              <Button type="submit" onClick={deleteLabel} variant="destructive" disabled={loading}>
                {deleteLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span>Deleting</span>
                  </>
                ) : (
                  <>Delete</>
                )}
              </Button>
          )}
        </div>
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

