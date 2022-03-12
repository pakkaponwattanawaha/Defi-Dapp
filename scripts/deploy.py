from brownie import accounts,network,config,MacToken,TokenFarm
from scripts.utils import get_account,get_contract
from web3 import Web3


KEPT_BALANCE = Web3.toWei(100,"ether")

def deploy_token_farm_and_mac_token():
    account = get_account()
    mac_token = MacToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(mac_token.address,{"from":account},publish_source = config["networks"][network.show_active()].get("verify",False))
    tx = mac_token.transfer(token_farm.address,mac_token.totalSupply()- KEPT_BALANCE,{"from":account})
    tx.wait(1)
    #mac_token, weth_token, fau_token
    weth_token = get_contract("weth_token") # => get from deployed mock contract in utils
    fau_token = get_contract("fau_token")
    dict_of_allowed_token = {
        mac_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }

    add_allowed_token(token_farm,dict_of_allowed_token,account)
    return token_farm,mac_token

def add_allowed_token(token_farm,dict_of_allowed_tokens,account):
    #price everything in USD
    for token in dict_of_allowed_tokens:
        add_token_tx = token_farm.addAllowedTokens(token.address,{"from":account})   
        add_token_tx.wait(1)
        set_token_tx = token_farm.setPriceFeedContract(token.address,dict_of_allowed_tokens[token], {"from":account})
        set_token_tx.wait(1)
    
def main():
    deploy_token_farm_and_mac_token()