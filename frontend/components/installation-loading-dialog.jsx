import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";

export default function InstallationWait({ open, setOpen}) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()} className="w-1/2">
        <DialogHeader>
          <DialogTitle>We are setting up your account</DialogTitle>
          <DialogDescription>
            this will take some time!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
            <Loader2 className="animate-spin mr-2" size={40} />
        </div>
       
      </DialogContent>
    </Dialog>

  )
}

