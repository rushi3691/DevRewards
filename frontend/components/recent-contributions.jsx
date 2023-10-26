import { use, useContext, useEffect, useState } from "react"
import ErrorPage from "next/error"
import Link from "next/link"
import {PushAPI} from "@pushprotocol/restapi"
import { ethers } from "ethers"
import { Loader2, Link as SomeLink } from "lucide-react"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AppContext } from "@/components/Global-States"

export default function RecentContributionsCard({ userName }) {
  const { isConnected } = useAccount()
  const {
    githubData,
    setGithubData,
    isGithubConnected,
    setIsGithubConnected,
    contract,
    isContract,
  } = useContext(AppContext)
  const [logsLoading, setLogsLoading] = useState(true)
  const [Logs, setLogs] = useState([])
  const [isLogs, setIsLogs] = useState(false)

  async function getNotifications() {
    // setLogsLoading(true)
    // const notifications = await PushAPI.user.getFeeds({
    //   user: "eip155:5:0xFC80A19A1475a98622D4b13b5105440995d403Ec", // user address in CAIP
    //   env: "staging",
    // })
    // const data = notifications
    //   .filter((notification) => {
    //     const sub = notification.message.split(":")
    //     if (sub.length < 3) {
    //       return false
    //     }
    //     return sub[0] == githubData.userId
    //   })
    //   .map((notification) => {
    //     const sub = notification.message.split(":")
    //     return {
    //       userId: sub[0],
    //       repo: sub[1],
    //       type: sub[2],
    //     }
    //   })
    // setLogs(data.slice(0, 5))
    // setLogsLoading(false)
  }
  useEffect(() => {
    getNotifications()
  }, [])
  return (
    <>
      <div className="container mt-20">
        <h1 className="text-3xl text-right font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Recent Contributions
        </h1>
        {logsLoading ? (
          <div className="flex items-center justify-center mt-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        ) : (
          <Table className="mt-8 mb-10">
            <TableCaption>A list of recent contributions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>UserId</TableHead>
                <TableHead>Repo</TableHead>
                <TableHead>type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Logs.map((log) => (
                <TableRow>
                  <TableCell>{log.userId}</TableCell>
                  <TableCell>{log.repo}</TableCell>
                  <TableCell>{log.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
