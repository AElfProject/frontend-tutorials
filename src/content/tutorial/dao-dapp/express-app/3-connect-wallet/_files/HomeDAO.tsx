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
      alert("Fetched proposals");
    } catch (error) {
      console.log(error, "=====error");
    }
  };

  //Step B - Create a new Wallet on Portkey
  const createWallet = async () => {
    
  };

  //Step C - Import Existing Portkey Wallet using Privatekey
  const importWalletUsingPrivatekey = async () => {

  };

  //Step D - Handle Login
  const handleLogin = async () => {

  };

  //Step E - Write Initialize Smart Contract and Join DAO Logic
  const initializeAndJoinDAO = async () => {
    
  };

  //Step H - Write Vote Yes Logic
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
      alert("Voted on Proposal");
      setHasVoted(true);
    } catch (error) {
      console.error(error, "=====error");
    }
  };

  // Step I - Use Effect to Fetch Proposals
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
          {isConnected ? "Connected" : "Login"}
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
