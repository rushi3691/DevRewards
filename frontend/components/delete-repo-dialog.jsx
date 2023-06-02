import { Button } from "@/components/ui/button"
import { useContext, useState } from "react";
import { AppContext } from "./Global-States";
import { Loader2} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export default function DeleteRepoDialog({ open, setOpen, repoId, repoName, fetchRepo, balance }) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);
    const { contract } = useContext(AppContext);


    const Delete = async () => {
        setLoading(true);
        try {
            const data = await contract.deleteRepo(repoId);
            await data.wait();
            toast({
                title: "Success!",
                description: `${repoName} deleted`,
            })
            fetchRepo();
        } catch (e) {
            console.log(e);
            toast({
                title: "Error!",
                description: `${e.message}`,
                variant: "destructive"
            })

        }
        setLoading(false);
        setOpen(false);
    }

    return (

        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently unlist your
                        repository and all of the funds will be transfered to you.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}> Cancel </AlertDialogCancel>
                    <Button type="submit" onClick={Delete} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                <span>Processing</span>
                            </>
                        ) : (
                            <>Unlist!</>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

