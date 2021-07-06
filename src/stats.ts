import * as utils from './utils';
import * as nano from './nano';
import * as types from './types';


export function currentPlayerFromBlock(block: any): types.Player {
    // Only care about receives
    var account = block['account']
    if ( block['type'] !== 'receive') { 
        utils.log("block is not receive for account " + account)
        return null
    }

    var remainder = BigInt(block['amount']) % BigInt('100000000000000000000000000000')
    if (remainder !== BigInt(0)) {
        // Player sent invalid amount to the game address
        return null
    }

    var number = BigInt(block['amount']) / BigInt('100000000000000000000000000000')
    
    var player: types.Player = {
        "account": account,
        "number": Number(number)
    }

    return player
}

export function getCurrentPlayers(blocks: any): types.Player[] {
    var currentPlayers = []
    blocks.forEach(block => {
        var player = currentPlayerFromBlock(block)
        if (player === null) {
            return
        }
        currentPlayers.push(player)
    });

    return currentPlayers
}

export function setCurrentPlayers(myAccount: string, difference: number) {
    nano.getAccountHistory(myAccount, difference, response => {
        var blocks = response.data.history
        var currentPlayers = getCurrentPlayers(blocks)
        utils.setCurrentPlayers(currentPlayers)
    },
    error => {
        utils.logError("Failed to get my account history. " + error)
    })
}

export function stats(myAccount: string) {
    utils.log("Getting stats of current game")
    // Get my account balance and write to the current pot file
    nano.getAccountBalance(myAccount, response => {
        utils.setCurrentPot(Number(BigInt(response.data.balance) / BigInt('100000000000000000000000000000')))
    },
    error => {
        utils.logError("Failed to get account balance for " + myAccount + ". " + JSON.stringify(error))
    })

    // Get all current players of the game
    nano.getAccountBlockCount(myAccount, response => {
        var currentHeight = Number(response.data.block_count)
        var difference = currentHeight - utils.getCurrentHeight()

        // Make sure atleast one player is playing
        if (difference < 1) {
            utils.setCurrentPlayers([])
            return
        }

        setCurrentPlayers(myAccount, difference)
    },
    error => {
        utils.logError("Failed to get my account block count. " + error)
    })
}