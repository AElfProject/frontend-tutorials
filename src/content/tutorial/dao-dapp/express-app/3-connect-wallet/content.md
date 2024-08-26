---
type: lesson
title: Connect Wallet Integration
template: dao-dapp
slug: connect-wallet-integration
focus: /src/HomeDAO.tsx
---

### Write Connect Wallet Function

Now, we'll write the Function for connect Portkey Wallet with out DAO dApp so Follow the Below steps.

- go to the `src/HomeDAO.tsx` file.

The `HomeDAO.tsx` file is the landing page of our Voting dApp. It allows users to interact with the deployed smart contract, join the DAO, view proposals, and vote on them.

Before users can interact with the smart contract, we need to write the Connect Wallet function.

- Find the comment `Step B - Connect Portkey Wallet`.

- Replace the existing `connect` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-9}
const connect = async () => {
  //Step B - Connect Portkey Wallet
  const accounts = await provider?.request({
    method: MethodsBase.REQUEST_ACCOUNTS,
  });
  const account = accounts?.tDVW?.[0];
  setCurrentWalletAddress(account);
  setIsConnected(true);
  alert("Successfully connected");
};
```

In this code, we fetch the Portkey wallet account using the provider and update the wallet address state variable. An alert notifies the user that their wallet is successfully connected.

With the Connect Wallet function defined, we're ready to write the remaining functions in the next steps.