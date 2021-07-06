import * as nano from './nano';
import * as utils from './utils';

var currentGameNumber = 0

export function playTheGame() {
    if (currentGameNumber === utils.getCurrentGameNumber()) {
        utils.log("Do not play game because the game number is the same")
        return
    }

    var wallet = utils.getWallet()
    var players = utils.getHousePlayers()
    var gameAccount = utils.getAccount()
    currentGameNumber = utils.getCurrentGameNumber()

    for (let i = 0; i < players.length; i++) {
        var player = players[i]
        var amount = i + 1
        var payment = BigInt(amount) * BigInt('100000000000000000000000000000')
        nano.sendPayment(wallet, player, gameAccount, payment, response => {
            utils.log("Successfully sent payment " + payment.toString() + " from " + player + " to " + gameAccount)
            utils.log(JSON.stringify(response))
        },
        error => {
            utils.logError("Failed to send the payment from " + player)
            utils.logError(JSON.stringify(error))
        })
    }
}