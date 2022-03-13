import React from "react";
import { Token } from "../Main";
import { Box } from "@material-ui/core";
interface WalletProps {
  supportedTokens: Array<Token>;
}

export const Wallet = ({ supportedTokens }: WalletProps) => {
  return (
    <Box>
      <h1>Your Wallet</h1>
      <div>Inside your wallet</div>
    </Box>
  );
};
