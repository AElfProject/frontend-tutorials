---
type: lesson
title: Connect wallet with aelf-sdk
template: dao-dapp
slug: connect-wallet-integration
focus: /HomeDAO.tsx
---

### Write Connect wallet with aelf-sdk

Now, we'll write the Function for Create and Import Portkey Wallet using aelf-sdk with out DAO dApp so Follow the Below steps.

1. Open the `HomeDAO.tsx` file.

The `HomeDAO.tsx` file is the landing page of our Voting dApp. It allows users to interact with the deployed smart contract, join the DAO, view proposals, and vote on them.

Before users can interact with the smart contract, we need to write the createWallet function.

- Find the comment `//Step B - Create a new Wallet on Portkey`.

- Replace the existing `createWallet` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-20}
//Step B - Create a new Wallet on Portkey
const createWallet = async () => {
  try {
    const newWallet = AElf.wallet.createNewWallet();
    localStorage.setItem("wallet", JSON.stringify(newWallet));
    const walletAddress = newWallet.address;
    const pwKey = newWallet?.privateKey;
    if (walletAddress && pwKey) {
      setCurrentWalletAddress(walletAddress);
      setPrivateKey(pwKey);
      setIsConnected(true);
    }
    await claimFaucet(walletAddress);
    Toast.fire({
      icon: "success",
      title: "Successfully Wallet Created"
    });
  } catch (error: any) {
    alert(error.message);
  }
};
```

- Scroll down and Find the comment `//Step C - Import Existing Portkey Wallet using Privatekey`.

- Replace the existing `importWalletUsingPrivatekey` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={2-34}
//Step C - Import Existing Portkey Wallet using Privatekey
const importWalletUsingPrivatekey = async () => {
  try {
    const { value: walletPrivateKey } = await Swal.fire({
      title: "Enter Privatekey of Your Portkey Wallet ",
      input: "password",
      inputPlaceholder: "Enter Privatekey",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      confirmButtonText: "Import Wallet",
      showCancelButton: true,
    });
    if(!walletPrivateKey){
      return
    }
    const wallet = AElf.wallet.getWalletByPrivateKey(walletPrivateKey);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    const walletAddress = wallet.address;
    const pwKey = wallet?.privateKey;
    if (walletAddress && pwKey) {
      setCurrentWalletAddress(walletAddress);
      setPrivateKey(pwKey);
      setIsConnected(true);
    }
    await claimFaucet(walletAddress);
    Toast.fire({
      icon: "success",
      title: "Successfully Wallet Imported"
    });
  } catch (error:any) {
    Swal.fire(error.message, "", "error");
  }
};
```

- Scroll down and Find the comment `// Step D - Claim ELF Token form API`.

- Replace the existing `claimFaucet` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-30}
// Step D - Claim ELF Token form API
const claimFaucet = async (walletAddress:string) => {
  // Check if the wallet address is provided by the user
  if (!walletAddress) {
    alert('Please enter a wallet address');  // Alert the user if the wallet address field is empty
    return;  // Exit the function if no wallet address is provided
  }

  try {
    // Make the POST request to the API endpoint with the provided wallet address
    const res = await fetch(`https://faucet.aelf.dev/api/claim?walletAddress=${walletAddress}`, {
      method: 'POST',  // Specify that this is a POST request
      headers: {
        'Content-Type': 'application/json',  // Set the content type header to JSON
      },
    });

    // Check if the response is not ok (i.e., any HTTP status code other than 200-299)
    if (!res.ok) {
      throw new Error('Failed to claim faucet');  // Throw an error if the request was unsuccessful
    }

    // Parse the response body as JSON
    const data = await res.json();

    console.log("claimFaucet response",data)
  } catch (error) {
    // Log any errors that occur during the fetch or response parsing
    console.error('Error claiming faucet:', error);
  }
};
```

- Scroll down and Find the comment `//Step E - Handle Login`.

- Replace the existing `handleLogin` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-18}
//Step D - Handle Login
const handleLogin = async () => {
  await Swal.fire({
    title: "Select Login Type",
    text: "How do you wanted to Login?",
    icon: "question",
    confirmButtonText: "Import Wallet",
    showDenyButton: true,
    denyButtonText: "Create new Wallet",
  }).then((result: any) => {
    if (result.isConfirmed) {
      // showing import wallet modal if user click on Import Wallet button
      importWalletUsingPrivatekey();
    } else if (result.isDenied) {
      // call createWallet function if user click on Create new Wallet button
      createWallet();
    }
  });
};
```

In this code, we fetch the Portkey wallet and created new wallet using **`aelf-sdk`** and update the wallet address state variable. now, we're ready to write the remaining functions in the next steps.
