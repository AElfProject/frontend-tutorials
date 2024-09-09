import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AElf from "aelf-sdk";
import { IWalletInfo } from "aelf-sdk/types/wallet";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

import "./HomeDAO.css";
import { Button } from "./components/ui/button";
import useDAOSmartContract from "./useDAOSmartContract";

interface IVotes {
  address: string;
}

interface IProposal {
  id: string;
  title: string;
  description: string;
  status: string;
  yesVotes: IVotes[];
  noVotes: IVotes[];
  voteThreshold: number;
}

interface IProposals {
  proposals: IProposal[];
}

interface IVoteInput {
  voter: string;
  proposalId: number;
  vote: boolean;
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast:any) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

function HomeDAO() {
  const [initialized, setInitialized] = useState(false);
  const [joinedDAO, setJoinedDAO] = useState(false);
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>();
  const [proposals, setProposals] = useState<IProposals>();
  const [isConnected, setIsConnected] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const DAOContract = useDAOSmartContract(privateKey);

  const navigate = useNavigate();

  const handleCreateProposalClick = () => {
    currentWalletAddress && navigate("/create-proposal");
  };

  const init = async () => {
    try {
      const walletResponse = localStorage.getItem("wallet");
      if (!walletResponse) {
        return;
      }
      const walletDetails: IWalletInfo = JSON.parse(walletResponse);
      const walletAddress = walletDetails.address;
      const pwKey = walletDetails?.privateKey;

      if (walletAddress && pwKey) {
        setCurrentWalletAddress(walletAddress);
        setPrivateKey(pwKey);
        setIsConnected(true);
      }
      if (!DAOContract) {
        return;
      }
      const proposalResponse = await DAOContract?.callViewMethod<IProposals>(
        "GetAllProposals",
        ""
      );
      setProposals(proposalResponse?.data);
      Toast.fire({
        icon: "success",
        title: "Fetched Proposals successfully"
      });
    } catch (error) {
      console.log(error, "=====error");
    }
  };

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
  

  //Step E - Handle Login
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
        importWalletUsingPrivatekey();
      } else if (result.isDenied) { 
        createWallet();
      }
    });
  };

  //Step F - Write Initialize Smart Contract and Join DAO Logic
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
        Toast.fire({
          icon: "success",
          title: "DAO Contract Successfully Initialized"
        });
      }

      const result = await DAOContract?.callSendMethod(
        "JoinDAO",
        currentWalletAddress as string,
        currentWalletAddress
      );
      console.log("result",result)
      setJoinedDAO(true);
      Toast.fire({
        icon: "success",
        title: "Successfully Joined DAO"
      });
    } catch (error) {
      console.error(error, "====error");
    }
  };

  //Step I - Write Vote Yes Logic
  const voteYes = async (index: number) => {

  };

  const voteNo = async (index: number) => {
    try {
      if (!DAOContract) {
        throw new Error("No DAOContract Exist!");
      }

      const createVoteInput: IVoteInput = {
        voter: currentWalletAddress as string,
        proposalId: index,
        vote: false,
      };

      await DAOContract?.callSendMethod(
        "VoteOnProposal",
        currentWalletAddress as string,
        createVoteInput
      );
      Toast.fire({
        icon: "success",
        title: "Voted on Proposal"
      })
      setHasVoted(true);
    } catch (error) {
      console.error(error, "=====error");
    }
  };

  // Step J - Use Effect to Fetch Proposals
  useEffect(() => {

  }, [DAOContract, hasVoted, isConnected, joinedDAO, privateKey]);

  useEffect(() => {
    !isConnected && init();
  }, [isConnected]);

  return (
    <div className="App">
      <div className="container header">
        <div className="logo">
          <img src="/src/assets/aelf_logo.png" alt="Aelf Logo" />
        </div>
        <div className="search-bar"></div>
        <Button
          onClick={() => !isConnected && handleLogin()}
          className="header-button"
        >
          {isConnected
            ? currentWalletAddress?.slice(0, 5) +
              "....." +
              currentWalletAddress?.slice(-5)
            : "Login"}
        </Button>
      </div>
      <div className="DAO-info">
        <div className="left-aligned">
          <header className="app-header">
            <div className="title-container">
              <h1>Welcome to Developer DAO</h1>

              <p className="subtitle">
                Developer DAO aims to empower developers with the foundation of
                how DAOs work
              </p>

              <p className="collaboration-message">
                🚀 Brought to you by Aelf Developer Community
              </p>
            </div>
            <div className="container"></div>
            <div className="header"></div>

            <Button className="header-button" onClick={initializeAndJoinDAO}>
              Join DAO
            </Button>
            <Button
              className="header-button"
              onClick={handleCreateProposalClick}
            >
              Create Proposal
            </Button>
          </header>
        </div>
      </div>
      <div className="proposal-list">
        <h2>Proposals of Developer DAO</h2>
        <div className="proposals">
          {proposals?.proposals.map((proposal, index) => (
            <div key={index} className="proposal-card">
              <h2>{proposal.title}</h2>
              <p>{proposal.description}</p>
              <p>Status: {proposal.status}</p>
              <p>Vote Threshold: {proposal.voteThreshold}</p>
              <p>Yes Votes: {proposal.yesVotes.length}</p>
              <p>No Votes: {proposal.noVotes.length}</p>
              <div className="button-group">
                <Button onClick={() => voteNo(index)}>Vote No</Button>
                <Button onClick={() => voteYes(index)}>Vote Yes</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeDAO;
