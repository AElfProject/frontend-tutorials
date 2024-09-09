---
type: lesson
title: Configure Portkey with aelf-sdk
template: dao-dapp
slug: configure-portkey-wallet
focus: /useDAOSmartContract.ts
---

### Configure Portkey with aelf-sdk

We'll set up our Portkey wallet using `aelf-sdk` to let users connect their Portkey wallets to our app and interact with our voting smart contract.

1. Open the `useDAOSmartContract.ts` file.

2. In this file, we'll create a component that initializes the Portkey wallet provider and fetches our deployed voting smart contract. This will enable our frontend components to interact with the smart contract for actions like joining the DAO, creating proposals, and more.

3. Locate the comment `Step A - Setup Portkey Wallet Provider` and replace the existing **useEffect** hook with the following code snippet:

```javascript title="useDAOSmartContract.ts" add={3-19}
 //Step A - Setup Portkey Wallet Provider
  useEffect(() => {
    const getContract = async () => {
      if (!walletPrivateKey) {
        return;
      }
      try {
        const wallet = AElf.wallet.getWalletByPrivateKey(walletPrivateKey);
        const contract = await getContractBasic({
          contractAddress: "2A9dd6syvmiqnFyDcybVvnvNhtNBWFjJqqaViQixNiWq6WSTQQ",
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
```

:::tip
ℹ️ Note: You are to replace the address placeholder with your deployed voting contract address from "Deploy Voting dApp Smart Contract"!

example:
//Replace with Address of Deployed Smart Contract
const address = "2GkJoDicXLqo7cR9YhjCEnCXQt8KUFUTPfCkeJEaAxGFYQo2tb";
:::

With fetch the vote contract, we're ready to write the function for Connect Portkey Wallet with our application on next step