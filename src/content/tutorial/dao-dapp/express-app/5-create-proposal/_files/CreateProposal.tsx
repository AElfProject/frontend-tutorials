"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import useDAOSmartContract from "./useDAOSmartContract";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import "./CreateProposal.css";
import { IWalletInfo } from "aelf-sdk/types/wallet";

interface IProposalInput {
  creator: string;
  title: string;
  description: string;
  voteThreshold: number;
}

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  voteThreshold: z.coerce.number(),
});

export default function CreateProposal() {
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>();
  const [privateKey, setPrivateKey] = useState("");
  const DAOContract = useDAOSmartContract(privateKey);

  const navigate = useNavigate();

  const handleReturnClick = () => {
    navigate("/");
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
      }
    } catch (error) {
      console.log(error, "=====error");
    }
  };

  useEffect(() => {
    if (!currentWalletAddress) init();
  }, [currentWalletAddress]);

  //Step G - Configure Proposal Form
  const form = useForm<z.infer<typeof formSchema>>({});

  // Step H - Write Create Proposal Logic
  function onSubmit(values: z.infer<typeof formSchema>) {
    
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-content">
          <h2 className="form-title">Create Proposal</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 proposal-form"
            >
              <div className="input-group">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Title for Proposal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="input-group">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Proposal Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="input-group">
                <FormField
                  control={form.control}
                  name="voteThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vote Threshold</FormLabel>
                      <FormControl>
                        <Input placeholder="Set Vote Threshold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="button-container">
                <button
                  type="button"
                  className="return-btn"
                  onClick={handleReturnClick}
                >
                  Return
                </button>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
