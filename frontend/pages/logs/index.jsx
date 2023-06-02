import { AppContext } from "@/components/Global-States";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ErrorPage from 'next/error';
import { useToast } from "@/components/ui/use-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ethers } from "ethers";
import { Link as SomeLink, Loader2 } from "lucide-react";
import Link from "next/link";

function convertSecondsToDateTime(timestamp) {
  const milliseconds = timestamp * 1000; // Convert seconds to milliseconds
  const date = new Date(milliseconds);

  // Extract the components of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month starts from 0, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date and time
  const formattedDateTime = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

  return formattedDateTime;
}

// Helper function to pad a number with leading zeros if needed
function padZero(number) {
  return number.toString().padStart(2, '0');
}


export default function LogsPage() {
  const { isConnected } = useAccount();
  const { githubData, setGithubData, isGithubConnected, setIsGithubConnected, contract, isContract } = useContext(AppContext);
  const [logsLoading, setLogsLoading] = useState(true);
  const [Logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const filter_contribute = contract.filters.contribute()
      const res1 = await contract.queryFilter(filter_contribute)

      const r1 = res1.map((log) => {
        return {
          timestamp: log.args.timestamp?.toNumber(),
          account: log.args.account,
          repoName: log.args.repoName,
          userName: log.args.userName,
          reward: ethers.utils.formatEther(log.args.reward),
          type: "code contribution",
          tx: log.transactionHash
        }
      })

      const filter_fund = contract.filters.fundsChanged()
      const res2 = await contract.queryFilter(filter_fund)

      const r2 = res2.map((log) => {
        return {
          timestamp: log.args.timestamp?.toNumber(),
          account: log.args.account,
          repoName: log.args.repoName,
          amount: ethers.utils.formatEther(log.args.amount),
          isAdded: log.args.isAdded,
          type: (log.args.isAdded) ? "Funding" : "Withdrawal",
          tx: log.transactionHash
        }
      })

      var log_data = [...r1, ...r2]
      log_data.sort((a, b) => {
        return b.timestamp - a.timestamp
      })

      setLogs(log_data)

    } catch (e) {
      console.log(e);
    }
    setLogsLoading(false);
  }

  useEffect(() => {
    if (isContract) {
      loadLogs();
    }
  }, [isContract])

  if (!isConnected || !isGithubConnected) {
    return <ErrorPage statusCode={404} title="Try connecting your wallet and github account" />
  }
  return (
    <>
      <div className="container mt-5">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Logs
        </h1>
        <div>
          {logsLoading ? (
            <div ClassName="flex items-center justify-center mt-8">
              <div ClassName="text-center">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            </div>
          ) : <>
            <Table className="mt-8">
              <TableCaption>A list of recent activities.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead className="text-right">Reward/Amount</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead> Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Logs.map((log) => (
                  <TableRow key={log.tx}>
                    <TableCell className="font-medium">{log.type}</TableCell>
                    <TableCell>{log.account}</TableCell>
                    <TableCell>{log.repoName}</TableCell>
                    <TableCell className="text-right">{log.reward ? log.reward.toString() : log.amount.toString()} ETH</TableCell>
                    <TableCell>{ convertSecondsToDateTime(log.timestamp)}</TableCell>
                    <TableCell><Link target="_blank" href={`https://sepolia.etherscan.io/tx/${log.tx}`}>
                      <SomeLink className="inline-block ml-2" size="1.5rem" />
                    </Link> </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>}
        </div>
      </div>
    </>
  )
}