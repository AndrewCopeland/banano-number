import * as utils from './utils';
import * as nano from './nano';
import * as stats from './stats';
import * as types from './types';

export function guessNumber(numbers: number) {
    return Math.floor(Math.random() * numbers) + 1;
}

export function guessAlgo() {
    var numberRange = 9
    var numbers = []
    var numbersLength = guessNumber(3)
    // utils.log("Set Size: " + numbersLength.toString())

    for (var i = 0; i < numbersLength; i++) {
        numbers.push(guessNumber(numberRange))
    }

    for(var i = numberRange; i > 0; i--) {
        if (utils.listContains(numbers, i)) {
            return i
        }
    }
    // Should never happen
    return 0
}

export function getRecievedAmountPlayersAndWinners(blocks: any, winningNumber: number): [bigint, types.Player[], string[]] {
    var receivedAmount = BigInt(0)
    var players: types.Player[] = []
    var winners: string[] = []

    blocks.forEach(block => {
        if (block['type'] !== 'receive') { 
            return   
        }
        var amount = BigInt(block['amount'])
        var player = stats.currentPlayerFromBlock(block)
        receivedAmount += amount

        // Player gave invalid amount therefor is disqualified
        if (player === null) {
            return
        }

        players.push(player)
        utils.log(player.account + " guessed " + player.number.toString())
        
        if (player.number === winningNumber) {
            utils.log(player.account + " WON")
            winners.push(player.account)
        }
    })

    return [receivedAmount, players, winners]
}

export function calculatePayment(pot: bigint, numberWinners: number): bigint {
    return pot / BigInt(numberWinners)
}

function distributeWinnings(currentHeight: number, myAccount: string) {
    // Should the game even start
    var gameHeight = utils.getCurrentHeight()
    if (currentHeight < gameHeight) {
        utils.logError("Current height is less the game height. This should not happen")
        return
    }
    

    if (currentHeight === gameHeight) {
        utils.logError("Current height is the same as the game height, no one played or transactions are pending")
        return
    }

    var difference = currentHeight - gameHeight
    if (difference == 1) {
        utils.logError("Game will not play because only 1 party is participating")
        return
    }


    var winningNumber = guessAlgo()
    utils.log("Winning Number: " + winningNumber)
    utils.setLastWinningNumber(winningNumber)
    utils.setLastWinners([])
    var dateTime = Date.now()
    utils.setCurrentGameTime(dateTime)

    nano.getAccountHistory(myAccount, difference, response => {
        var blocks = response.data.history        
        let [receivedAmount, players, winners] = getRecievedAmountPlayersAndWinners(blocks, winningNumber)

        utils.log("Received amount: " + receivedAmount.toString())
        utils.log("Number of Winners: " + winners.length.toString())

        var pot = utils.getRollOverPot() + receivedAmount
        utils.log("The pot: " + pot)
        var gameNumber = utils.getCurrentGameNumber()

        // write players, clear current players, set the last pot and increment current game number
        utils.setLastPlayers(players)
        utils.setCurrentPlayers([])
        utils.setLastPot(pot)
        utils.setCurrentGameNumber(utils.getCurrentGameNumber() + 1)
        utils.setLastWinners(winners)
        utils.setCurrentHeight(currentHeight)

        var gameHistory: types.History = {
            id: gameNumber,
            pot: pot.toString(),
            distribution: '0',
            winning_number: winningNumber,
            time_played: dateTime,
            players: players,
            winners: winners
        }

        // No winners update rollover pot and current height and end game
        if (winners.length === 0) {
            utils.log("No Winners")
            utils.setRollOverPot(pot)
            utils.appendGameHistory(gameHistory)
            return
        }

        // winners exist clear the roll over pot
        utils.setRollOverPot(BigInt(0))
        var payment = calculatePayment(pot, winners.length)
        gameHistory.distribution = payment.toString()
        utils.appendGameHistory(gameHistory)

        utils.log("Payment being distributed: " + payment.toString())
        nano.sendPayments(utils.getWallet(), utils.getAccount(), winners, payment, response => {
            utils.log("Sent Payment")
            utils.log(response)
        }, error => {
            utils.logError("Error occured when sending payments: " + JSON.stringify(error))
        });
    },
    error => {
        utils.logError("Error playing game and distributing payments")
        utils.logError(error)
    })
}

export function startGame() {
    var myAccount = utils.getAccount()
    nano.getAccountBlockCount(myAccount, response => {
        var currentHeight = Number(response.data.block_count)
        distributeWinnings(currentHeight, myAccount)
    },
    error => {
        utils.logError("Failed to get the current block count to start the game")
        utils.logError(error)
    })
}