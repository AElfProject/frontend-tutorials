---
type: lesson
title: Configure Portkey Provider
template: dao-dapp
slug: configure-portkey-provider
---

### Configure Portkey Provider

We'll set up our Portkey provider to let users connect their Portkey wallets to our app and interact with our voting smart contract.

1. Go to the `src/useDAOSmartContract.ts` file.

2. In this file, we'll create a component that initializes the Portkey wallet provider and fetches our deployed voting smart contract. This will enable our frontend components to interact with the smart contract for actions like joining the DAO, creating proposals, and more.

3. Locate the comment `Step A - Setup Portkey Wallet Provider` and replace the existing **useEffect** hook with the following code snippet:

```javascript title="useDAOSmartContract.ts" add={3-21}
//Step A - Setup Portkey Wallet Provider
useEffect(() => {
  (async () => {
    if (!provider) return null;

    try {
      // 1. get the sidechain tDVW using provider.getChain
      const chain = await provider?.getChain("tDVW");
      if (!chain) throw new Error("No chain");

      //Address of DAO Smart Contract
      //Replace with Address of Deployed Smart Contract
      const address = "your_deployed_voting_contract_address";

      // 2. get the DAO contract
      const daoContract = chain?.getContract(address);
      setSmartContract(daoContract);
    } catch (error) {
      console.log(error, "====error");
    }
  })();
}, [provider]);
```

:::tip
ℹ️ Note: You are to replace the address placeholder with your deployed voting contract address from "Deploy Voting dApp Smart Contract"!

example:
//Replace with Address of Deployed Smart Contract
const address = "your_deployed_voting_contract_address";
:::

With fetch the vote contract, we're ready to write the function for Connect Portkey Wallet with our application on next step