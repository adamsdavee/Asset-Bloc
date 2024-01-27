import React, { useState, useEffect, createContext, ReactNode, useCallback } from "react";
import contractArtifact from "@/config/utils/FIS.json";
import tokenArtifact from "@/config/utils/FISCoin.json";
import { ethers, Contract } from "ethers";


import { bigIntToString } from "@/lib/utils";

export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // Sepolia - "0x5C538b7DD2BdCA1da1b60E3Ff4a8b7a5e9F2170c"
const contractABI = contractArtifact.abi;
export const CONTRACT_OWNER = "0xBe1dB9047Ab848E4307705057B2890FCA7962C1D";
export const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Sepolia - "0xe9134e7d586232d14C4768E3Dd755Ca19d5C8020" 
const tokenABI = tokenArtifact.abi;

type AppContextType = {
  connected: boolean,
  signerAddress: string | undefined,
  balance: string,
  contract: ethers.Contract | undefined,
  signer: ethers.JsonRpcSigner | undefined,
  provider: ethers.BrowserProvider | undefined,
  setup: () => void,
};

export const AppContext = createContext<AppContextType>({
  connected: false,
  signerAddress: "",
  balance: "",
  contract: undefined,
  signer: undefined,
  provider: undefined,
  setup: () => {},
});

interface AppProviderPropTypes {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppProviderPropTypes) => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(
    undefined
  );
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(
    undefined
  );
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined
  );
  const [signerAddress, setSignerAddress] = useState<string | undefined>(
    undefined
  );
  const [balance, setBalance] = useState("");
    
  const setup = async () => {
    if (
      typeof window !== "undefined" &&
      typeof (window as any).ethereum !== "undefined"
    ) {
      const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        (window as any).ethereum!
      );
      // const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider()
      setProvider(provider);

      await provider.send("eth_requestAccounts", []);

      if (provider !== undefined) {
        const signer = await provider.getSigner();
        setSigner(signer);
        console.log({ signer });

        const address = await signer.getAddress();
        setSignerAddress(address);
        console.log({ address });

        const balance = await provider.getBalance(address);
        setBalance(bigIntToString(balance));


        const mainContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );
        console.log({ mainContract });
        setContract(mainContract);

        setConnected(true);
      }
    }
  };




  return (
    <AppContext.Provider
      value={{
        connected,
        signerAddress,
        balance,
        contract,
        signer,
        provider,
        setup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
