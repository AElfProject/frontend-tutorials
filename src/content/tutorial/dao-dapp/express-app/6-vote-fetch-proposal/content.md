---
type: lesson
title: Vote & Fetch Proposals Function
template: dao-dapp
slug: vote-and-fetch-proposal
---

### Write Vote & Fetch Proposals Function

In this step, we'll write the Vote and Fetch Proposals functions to complete our Voting dApp's frontend components.

- Go to the `src/HomeDAO.tsx` file.

- Scroll to the `Step F - Write Vote Yes Logic comment`.

- Replace the `voteYes` function with this code snippet:

```javascript title="src/HomeDAO.tsx" add={3-29}
const voteYes = async (index: number) => {
  //Step F - Write Vote Yes Logic
  try {
    const accounts = await provider?.request({
      method: MethodsBase.ACCOUNTS,
    });

    if (!accounts) throw new Error("No accounts");

    const account = accounts?.tDVW?.[0];

    if (!account) throw new Error("No account");

    const createVoteInput: IVoteInput = {
      voter: account,
      proposalId: index,
      vote: true,
    };

    await DAOContract?.callSendMethod(
      "VoteOnProposal",
      account,
      createVoteInput
    );
    alert("Voted on Proposal");
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

- Scroll down to the `Step G - Use Effect to Fetch Proposals` comment and replace the `useEffect` hook with this code snippet:

```tsx title="src/HomeDAO.tsx" add={3-29}
useEffect(() => {
  // Step G - Use Effect to Fetch Proposals
  const fetchProposals = async () => {
    try {
      const accounts = await provider?.request({
        method: MethodsBase.ACCOUNTS,
      });

      if (!accounts) throw new Error("No accounts");

      const account = accounts?.tDVW?.[0];

      if (!account) throw new Error("No account");

      if (!DAOContract) return;

      const proposalResponse = await (DAOContract?.callViewMethod)<IProposals>(
        "GetAllProposals",
        ""
      );

      setProposals(proposalResponse.data);
      alert("Fetched Proposals");
    } catch (error) {
      console.error(error);
    }
  };

  fetchProposals();
}, [DAOContract, hasVoted, isConnected, joinedDAO]);
```

#### Here's what the function does:

1. Defines the `fetchProposals` function that fetches the wallet address.

2. Calls the `GetAllProposals` function from the smart contract, returning a list of proposals.

3. Updates the state and shows an alert once the proposals are fetched.

Now that we've written all the necessary frontend functions and components, we're ready to see the output and test the Voting functionalities.