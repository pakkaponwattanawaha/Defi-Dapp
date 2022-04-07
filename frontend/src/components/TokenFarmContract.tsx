import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// import { ConnectionRequiredMsg } from "../../components";
import { Tab, Box, makeStyles } from "@material-ui/core";
import { Token } from "../pages/Main";
import { UnstakeForm } from "./Wallet/UnstakeForm";

interface TokenFarmContractProps {
  supportedTokens: Array<Token>;
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(6),
    paddingBlockStart: theme.spacing(2),
  },
  box: {
    backgroundColor: "#fbfbfb",
    borderRadius: theme.spacing(1.5),
    border: "1px solid rgb(229, 232, 235)",
    boxShadow: "rgb(12 22 44 / 32%) 0px 8px 24px -16px",
  },
  header: {
    color: "rgb(4, 17, 29)",
    fontFamily: "sans-serif",
    fontWeight: 600,
  },
  blurred: {
    backdropFilter: "blur(10px)",
  },
}));

export const TokenFarmContract = ({
  supportedTokens,
}: TokenFarmContractProps) => {
  const classes = useStyles();
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue));
  };

  const { account } = useEthers();

  const isConnected = account !== undefined;

  return (
    <Box>
      <h1 className={classes.header}>Staked Token</h1>
      <Box className={classes.box}>
        <div>
          {isConnected ? (
            <TabContext value={selectedTokenIndex.toString()}>
              <TabList onChange={handleChange} aria-label="stake form tabs">
                {supportedTokens.map((token, index) => {
                  return (
                    <Tab
                      label={token.name}
                      value={index.toString()}
                      key={index}
                    />
                  );
                })}
              </TabList>
              {supportedTokens.map((token, index) => {
                return (
                  <TabPanel value={index.toString()} key={index}>
                    <div className={classes.tabContent}>
                      <UnstakeForm token={token} />
                    </div>
                  </TabPanel>
                );
              })}
            </TabContext>
          ) : (
            <></>
            // <ConnectionRequiredMsg />
          )}
        </div>
      </Box>
    </Box>
  );
};
