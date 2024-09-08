import { useEffect, useState } from "react";
import AElf from "aelf-sdk";
import { getContractBasic, IPortkeyContract } from "@portkey/contracts";

const useDAOSmartContract = (walletPrivateKey?: string | undefined) => {
  const [smartContract, setSmartContract] = useState<IPortkeyContract>();

  //Step A - Setup Portkey Wallet Provider
  useEffect(() => {
    const getContract = async () => {
      if (!walletPrivateKey) {
        return;
      }
      try {
        const wallet = AElf.wallet.getWalletByPrivateKey(walletPrivateKey);
        const contract = await getContractBasic({
          contractAddress: "your_deployed_voting_contract_address",
          account: wallet,
          rpcUrl: "https://tdvw-test-node.aelf.io",
        });
        setSmartContract(contract);
      } catch (error) {
        console.log("error in getContract", error);
      }
    };
    walletPrivateKey && getContract();
  }, [walletPrivateKey]);

  return smartContract;
};

export default useDAOSmartContract;
