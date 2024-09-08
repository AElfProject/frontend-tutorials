---
type: lesson
title: Connect Wallet Integration
template: dao-dapp
slug: connect-wallet-integration
focus: /HomeDAO.tsx
---

### Write Connect Wallet Function

Now, we'll write the Function for connect Portkey Wallet with out DAO dApp so Follow the Below steps.

1. Open the `HomeDAO.tsx` file.

The `HomeDAO.tsx` file is the landing page of our Voting dApp. It allows users to interact with the deployed smart contract, join the DAO, view proposals, and vote on them.

Before users can interact with the smart contract, we need to write the createWallet function.

- Find the comment `//Step B - Create a new Wallet on Portkey`.

- Replace the existing `createWallet` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={3-19}
//Step B - Create a new Wallet on Portkey
const createWallet = async () => {
  try {
    // creating a new wallet by using createNewWallet function in aelf-sdk
    const newWallet = AElf.wallet.createNewWallet();
    // storing wallet data in local storage
    localStorage.setItem("wallet", JSON.stringify(newWallet));
    const walletAddress = newWallet.address;
    const pwKey = newWallet?.privateKey;
    if (walletAddress && pwKey) {
      // set the wallet data in local states
      setCurrentWalletAddress(walletAddress);
      setPrivateKey(pwKey);
      setIsConnected(true);
    }
    Swal.fire("Successfully Wallet Created", "", "success");
  } catch (error: any) {
    alert(error.message);
  }
};
```

- Scroll down and Find the comment `//Step C - Import Existing Portkey Wallet using Privatekey`.

- Replace the existing `importWalletUsingPrivatekey` function with this code snippet:

```javascript title="src/HomeDAO.ts" add={2-32}
//Step C - Import Existing Portkey Wallet using Privatekey
const importWalletUsingPrivatekey = async () => {
  try {
    // show popup modal with input field
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
    // importing wallet by privatekey using getWalletByPrivateKey function in aelf-sdk
    const wallet = AElf.wallet.getWalletByPrivateKey(walletPrivateKey);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    const walletAddress = wallet.address;
    const pwKey = wallet?.privateKey;
    if (walletAddress && pwKey) {
      setCurrentWalletAddress(walletAddress);
      setPrivateKey(pwKey);
      setIsConnected(true);
    }
    Swal.fire("Successfully Wallet Imported", "", "success");
  } catch (error:any) {
    Swal.fire(error.message, "", "error");
  }
};
```

- Scroll down and Find the comment `//Step D - Handle Login`.

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
