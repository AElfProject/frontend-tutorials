import { useEffect, useState } from "react";
import AElf from "aelf-sdk";
import { getContractBasic, IPortkeyContract } from "@portkey/contracts";

const useDAOSmartContract = (walletPrivateKey?: string | undefined) => {
  const [smartContract, setSmartContract] = useState<IPortkeyContract>();

  //Step A - Setup Portkey Wallet Provider
  useEffect(() => {

  }, [walletPrivateKey]);

  return smartContract;
};

export default useDAOSmartContract;
