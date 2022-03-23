import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "sans-serif",
  },
  balancetext: {
    fontWeight: 400,
    fontSize: "16px",
  },
  tokenImg: {
    width: "36px",
    paddingLeft: "10px",
  },
  amount: {
    fontWeight: 600,
    paddingLeft: "10px",
  },
  tokenLabel: {
    fontWeight: 400,
    paddingLeft: "10px",
  },
}));

interface BalanceMsgProps {
  label: string;
  amount: number;
  tokenImgSrc: string;
  type: string;
}

export const BalanceMsg = ({
  label,
  amount,
  tokenImgSrc,
  type,
}: BalanceMsgProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {type == "stake" ? (
        <span className={classes.balancetext}>Wallet Balance: </span>
      ) : (
        <span className={classes.balancetext}>Amount Staked: </span>
      )}
      <img className={classes.tokenImg} src={tokenImgSrc} alt="token logo" />
      <span className={classes.amount}>{amount}</span>
      <span className={classes.tokenLabel}>{label}</span>
    </div>
  );
};
