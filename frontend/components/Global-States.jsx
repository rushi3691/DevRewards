import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants";
import { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useRouter } from "next/router";


const AppContext = createContext();


const AppProvider = ({ children }) => {
  const router = useRouter();
  const [githubData, setGithubData] = useState(null);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const { isConnected, address, connector } = useAccount();
  const [isContract, setIsContract] = useState(false);

  useEffect(() => {
    const getGithubData = async () => {
      try {
        const provider = await connector.getProvider();
        const providerEther = new ethers.providers.Web3Provider(provider);
        const signer = providerEther.getSigner();
        const address_ethers = await signer.getAddress();
        // console.log("address_ethers", address_ethers);
        const contract_inst = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        const userInfo = await contract_inst.users(address_ethers);

        const data = {
          userId: userInfo.userId,
          installationId: userInfo.installationId,
          email: userInfo.email,
          name: userInfo.name,
          commitCount: userInfo.commitCount?.toString(),
          rewardsEarned: ethers.utils.formatEther(userInfo.rewardsEarned)?.toString(),
          activeRepos: userInfo.activeRepos?.toString(),
        }
        // console.log("data", data);
        if(data.userId !== ""){
          setGithubData(data);
          setIsGithubConnected(true);
        }
        setContract(contract_inst);
        setIsContract(true);
      }
      catch (e) {
        console.log(e)
      }
    }
    if (isConnected && connector) {
      getGithubData();
    }else if(!isConnected){
      setGithubData(null);
      setIsGithubConnected(false);
      setContract(null);
      setIsContract(false);
      router.push({ pathname: '/' });
    }
  }, [isConnected, connector]);

  const value = {
    githubData,
    setGithubData,
    isGithubConnected,
    setIsGithubConnected,
    contract,
    isContract,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;

}

export { AppContext, AppProvider };


