import * as nano from './nano';
import * as utils from './utils';


export function boostGame() {
    var account = utils.getBoostAccount()
    nano.getAccountBalance(account, response => {
        var balance = BigInt(response.data.balance)
        if (balance === BigInt(0)) {
            return
        }
        nano.sendPayment(utils.getWallet(), account, utils.getAccount(), balance, response => {
            utils.log("Successfully boosted game " + balance.toString() + " banano.")
            utils.log(JSON.stringify(response))
        },
        error => {
            utils.logError("Failed to boost game. " + JSON.stringify(error))
        })
    },
    error => {
        utils.logError("Failed to get boost account balance. " + JSON.stringify(error))
    })
}