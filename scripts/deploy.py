from brownie import accounts, network, config, MacToken, TokenFarm
from scripts.utils import get_account, get_contract
from web3 import Web3
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_mac_token(do_update_front_end=False):
    account = get_account()
    mac_token = MacToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        mac_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    tx = mac_token.transfer(
        token_farm.address, mac_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)
    # mac_token, weth_token, fau_token
    weth_token = get_contract(
        "weth_token"
    )  # => get from deployed mock contract in utils
    fau_token = get_contract("fau_token")
    dict_of_allowed_token = {
        mac_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }

    add_allowed_token(token_farm, dict_of_allowed_token, account)
    if do_update_front_end:
        update_front_end()
    return token_farm, mac_token


def add_allowed_token(token_farm, dict_of_allowed_tokens, account):
    # price everything in USD
    for token in dict_of_allowed_tokens:
        add_token_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_token_tx.wait(1)
        set_token_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_tokens[token], {"from": account}
        )
        set_token_tx.wait(1)


def update_front_end():
    # send the whole build data to frontend
    copy_folders_to_front_end("./build", "./frontend/src/chain-info")

    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_mac_token(do_update_front_end=True)
