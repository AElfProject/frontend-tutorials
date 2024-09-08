---
type: lesson
title: Initialize Smart Contract
template: dao-dapp
slug: initialize-smart-contract
focus: /HomeDAO.tsx
---

### Write Initialize Smart Contract & Join DAO Functions

Let's write the Initialize and Join DAO functions.

- Find the comment `Step E - Write Initialize Smart Contract and Join DAO Logic` in `HomeDAO.tsx` File.

- Replace the existing `initializeAndJoinDAO` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-27}
//Step E - Write Initialize Smart Contract and Join DAO Logic
const initializeAndJoinDAO = async () => {
  try {
    if (!DAOContract) {
      throw new Error("No DAOContract Exist!");
    }

    if (!initialized) {
      await DAOContract?.callSendMethod(
        "Initialize", 
        currentWalletAddress as string,
        {}
      );
      setInitialized(true);
      alert("DAO Contract Successfully Initialized");
    }

    await DAOContract?.callSendMethod(
      "JoinDAO",
      currentWalletAddress as string,
      currentWalletAddress
    );
    setJoinedDAO(true);
    alert("Successfully Joined DAO");
  } catch (error) {
    console.error(error, "====error");
  }
};
```

#### Here's what the function does:

1. Fetches your wallet account using the Portkey wallet provider.

2. Initializes the DAO smart contract if it hasn't been done already, updating the state and showing a success alert.

3. Calls the JoinDAO method with your wallet address, updating the state and showing a success alert.

Now, wrap the `initializeAndJoinDAO` function in the "Join DAO" button to trigger both Initialize and JoinDAO when clicked.

![jao-button](../../../../../assets/fe-join-dao-button.png)

Next, we'll write the **Create Proposal** function on next step
