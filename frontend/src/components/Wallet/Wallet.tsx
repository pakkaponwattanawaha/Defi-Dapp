import React, { useState } from "react";
import { Token } from "../../pages/Main";
import { Box, Tab, makeStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { StakeForm } from "./StakeForm";
import { WalletBalance } from "./WalletBalance";
interface WalletProps {
  supportedTokens: Array<Token>;
}
const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
    paddingBlockStart: theme.spacing(2),
  },
  box: {
    backgroundColor: "#fbfbfb",
    borderRadius: theme.spacing(1.5),
    border: "1px solid rgb(229, 232, 235)",
    boxShadow: "rgb(12 22 44 / 32%) 0px 8px 24px -16px",
  },
  header: {
    fontFamily: "sans-serif",
    fontWeight: 600,
    color: "rgb(4, 17, 29)",
  },
}));

export const Wallet = ({ supportedTokens }: WalletProps) => {
  const classes = useStyles();
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setSelectedTokenIndex(parseInt(newValue));
  };
  return (
    <Box>
      <h1 className={classes.header}> Stake Your Token </h1>
      <Box className={classes.box}>
        <TabContext value={selectedTokenIndex.toString()}>
          <TabList
            onChange={handleTabChange}
            aria-label="stake from tabs"
            indicatorColor="secondary"
          >
            {supportedTokens.map((token, index) => {
              return (
                <Tab
                  label={token.name}
                  value={index.toString()}
                  key={index}
                ></Tab>
              );
            })}
          </TabList>
          {supportedTokens.map((token, index) => {
            return (
              <TabPanel value={index.toString()} key={index}>
                <div className={classes.tabContent}>
                  <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                  <StakeForm token={supportedTokens[selectedTokenIndex]} />
                </div>
              </TabPanel>
            );
          })}
        </TabContext>
      </Box>
    </Box>
  );
};
