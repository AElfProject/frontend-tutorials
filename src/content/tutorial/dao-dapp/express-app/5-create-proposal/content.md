---
type: lesson
title: Create Proposal Function
template: dao-dapp
slug: create-proposal
---

### Write Create Proposal Function

Let's write the Create Proposal function.

- Go to the `src/CreateProposal.tsx` file. This file is the "Create Proposal" page where users can enter details like the proposal title, description, and vote threshold.

- Find the comment `Step D - Configure Proposal Form`.

- Replace the form variable with this code snippet:

```tsx title="src/CreateProposal.tsx" add={3-9}
//Step D - Configure Proposal Form
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    address: currentWalletAddress,
    title: "",
    description: "",
    voteThreshold: 0,
  },
});
```

:::tip
ℹ️ Note: We set `currentWalletAddress` as the default value because the wallet address is passed from the HomeDAO.tsx page when the user clicks "Create Proposal" on the landing page.

Default value:
`address: currentWalletAddress`
:::

#### Here's what the function does:

1. Initializes a new form variable with default values needed to create a proposal.

2. Fields include: `address` , `title` , `description` , and `vote threshold`.

Now your form is ready for users to fill in the necessary details for their proposal.

Now, let's write the Create Proposal function for the form submission.

- Scroll down to find the comment `Step E - Write Create Proposal Logic`.

- Replace the onSubmit function with this code snippet:

```javascript title="src/CreateProposal.tsx" add={3-25}
// Step E - Write Create Proposal Logic
function onSubmit(values: z.infer<typeof formSchema>) {
  const proposalInput: IProposalInput = {
    creator: currentWalletAddress,
    title: values.title,
    description: values.description,
    voteThreshold: values.voteThreshold,
  };

  const createNewProposal = async () => {
    try {
      await DAOContract?.callSendMethod(
        "CreateProposal",
        currentWalletAddress,
        proposalInput
      );

      navigate("/");
      alert("Successfully created proposal");
    } catch (error) {
      console.error(error);
    }
  };

  createNewProposal();
}
```

#### Here's what the function does:

1. Creates a new `proposalInput` variable with form fields: `title` , `description` , and `vote threshold`.

2. Invokes the `CreateProposal` function of the deployed smart contract, using the current wallet address and `proposalInput`.

3. If successful, navigates the user to the landing page and shows an alert that the proposal was created.

Next, we'll write the **Vote** and **Fetch Proposal** functions to complete the frontend components of our Voting dApp in Next Step
