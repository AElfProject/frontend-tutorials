---
type: lesson
title: Vote & Fetch Proposals Function
template: dao-dapp
slug: vote-and-fetch-proposal
focus: /HomeDAO.tsx
---

### Write Vote & Fetch Proposals Function

In this step, we'll write the Vote and Fetch Proposals functions to complete our Voting dApp's frontend components.

- Open the `HomeDAO.tsx` file.

- Scroll to the `Step I - Write Vote Yes Logic`.

- Replace the `voteYes` function with this code snippet:

```javascript title="src/HomeDAO.tsx" add={3-27}
//Step I - Write Vote Yes Logic
const voteYes = async (index: number) => {
  try {
    if (!DAOContract) {
      throw new Error("No DAOContract Exist!");
    }

    const createVoteInput: IVoteInput = {
      voter: currentWalletAddress as string,
      proposalId: index,
      vote: true,
    };

    await DAOContract?.callSendMethod(
      "VoteOnProposal",
      currentWalletAddress as string,
      createVoteInput
    );

    Toast.fire({
      icon: "success",
      title: "Voted on Proposal"
    });
    setHasVoted(true);
  } catch (error) {
    console.error(error, "=====error");
  }
};
```

#### Here's what the function does:

1. Takes an `index` parameter, representing the proposal ID to vote on.

2. Fetches the wallet address using the Portkey provider.

3. Creates a `createVoteInput` parameter with the voter's wallet address, proposal ID, and a `true` value for a Yes vote..

4. Calls the `VoteOnProposal` function from the smart contract.

5. Updates the state and shows an alert upon a successful vote.

The `voteNo` function works similarly but sets the vote to `false`.

- Scroll down to the `Step J - Use Effect to Fetch Proposals` comment and replace the `useEffect` hook with this code snippet:

```tsx title="src/HomeDAO.tsx" add={3-25}
// Step J - Use Effect to Fetch Proposals
useEffect(() => {
  const fetchProposals = async () => {
    try {
      if (!DAOContract) {
        throw new Error("No DAOContract Exist!");
      }
      const proposalResponse =
        await (DAOContract?.callViewMethod)<IProposals>(
          "GetAllProposals",
          ""
        );

      setProposals(proposalResponse.data);
      
      Toast.fire({
        icon: "success",
        title: "Fetched Proposals successfully"
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchProposals();
}, [DAOContract, hasVoted, isConnected, joinedDAO, privateKey]);
```

#### Here's what the function does:

1. Defines the `fetchProposals` function that fetches the wallet address.

2. Calls the `GetAllProposals` function from the smart contract, returning a list of proposals.

3. Updates the state and shows an alert once the proposals are fetched.

Now that we've written all the necessary frontend functions and components, we're ready to see the output and test the Voting functionalities.
