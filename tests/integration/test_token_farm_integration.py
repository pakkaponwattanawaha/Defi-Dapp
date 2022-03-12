from brownie import network
from scripts.utils import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
)
from scripts.deploy import deploy_token_farm_and_mac_token
import pytest


def test_stake_and_issue_correct_amounts(amount_staked):
    # Arrange
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for integration testing!")
    token_farm, mac_token = deploy_token_farm_and_mac_token()
    account = get_account()
    mac_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, mac_token.address, {"from": account})
    starting_balance = mac_token.balanceOf(account.address)
    price_feed_contract = get_contract("dai_usd_price_feed")
    (_, price, _, _, _) = price_feed_contract.latestRoundData()
    # Stake 1 token
    # 1 Token = $2000
    # We should be issued, 2000 tokens
    amount_token_to_issue = (
        price / 10 ** price_feed_contract.decimals()
    ) * amount_staked
    # Act
    issue_tx = token_farm.issueTokens({"from": account})
    issue_tx.wait(1)
    # Assert
    assert (
        mac_token.balanceOf(account.address) == amount_token_to_issue + starting_balance
    )
