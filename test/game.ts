import * as game from '../src/game'
import { expect } from 'chai';

import 'mocha';

function newBlock(type: string, amount: BigInt, account: string): any {
    return {
        "type": type,
        "amount": amount.toString(),
        "account": account
    }
}

function randomValidBlock(): any {
    var amount = BigInt(game.guessNumber(9).toString() + '00000000000000000000000000000')
    var account = "ban_" + Math.random().toString(36).replace(/[^a-z]+/g,'').substr(0, 20)
    return newBlock('receive', amount, account)
}

function getRandomValidBlocks(amount: number): any {
    var blocks = []
    for (let i = 0; i < amount; i++) {
        blocks.splice(randomValidBlock())
    }
    return blocks
}

function minThreshold(number: number): number {
    return (number / 45 * 100000) - 300
}

function maxThreshold(number: number): number {
    return (number / 45 * 100000) + 300
}


describe('Game tests', () => {
    it('Test game calculate payment', () => {
        var pot = BigInt('10000000')
        var numberWinners = 5
        var correctAnswer = BigInt('2000000')
        var result = game.calculatePayment(pot, numberWinners)
        expect(result).to.equal(correctAnswer)

        result = game.calculatePayment(pot, 1)
        expect(result).to.equal(pot)

        result = game.calculatePayment(pot, 67)
        expect(result).to.equal(BigInt('149253'))

        result = game.calculatePayment(pot, 3)
        expect(result).to.equal(BigInt('3333333'))

        result = game.calculatePayment(BigInt('66784999292346891557'), 3)
        expect(result).to.equal(BigInt('22261666430782297185'))
    })

    it('Test get winners, receive and players', () => {
        var allWinningNumbers = [1,2,3,4,5,6,7,8,9]
        var blocks = [
            {
                "type": "receive",
                "amount": "100000000000000000000000000000",
                "account": "ban_abc"
            },
            {
                "type": "receive",
                "amount": "200000000000000000000000000000",
                "account": "ban_abc2"
            },
            {
                "type": "receive",
                "amount": "300000000000000000000000000000",
                "account": "ban_abc3"
            },
            {
                "type": "receive",
                "amount": "400000000000000000000000000000",
                "account": "ban_abc4"
            },
            {
                "type": "receive",
                "amount": "500000000000000000000000000000",
                "account": "ban_abc5"
            },
            {
                "type": "receive",
                "amount": "600000000000000000000000000000",
                "account": "ban_abc6"
            },
            {
                "type": "receive",
                "amount": "700000000000000000000000000000",
                "account": "ban_abc7"
            },
            {
                "type": "receive",
                "amount": "800000000000000000000000000000",
                "account": "ban_abc8"
            },
            {
                "type": "receive",
                "amount": "900000000000000000000000000000",
                "account": "ban_abc9"
            },
            {
                "type": "receive",
                "amount": "100000000000000000000000000001",
                "account": "ban_invalid1"
            },
            {
                "type": "receive",
                "amount": "100000000000000000000000000002",
                "account": "ban_invalid2"
            },
            {
                "type": "receive",
                "amount": "100000000000000000000000000003",
                "account": "ban_invalid3"
            }
        ]
        allWinningNumbers.forEach(winningNumber => {
            let[receivedAmount, players, winners] = game.getRecievedAmountPlayersAndWinners(blocks, winningNumber)
            expect(receivedAmount).to.equal(BigInt('4800000000000000000000000000006'))
            expect(players.length).to.equal(9)
            expect(winners.length).to.equal(1)
        });
        
    })

    it('Test a lot of players', () => {
        var allWinningNumbers = [1,2,3,4,5,6,7,8,9]
        var players = getRandomValidBlocks(10000)
        allWinningNumbers.forEach(winningNumber => {
            game.getRecievedAmountPlayersAndWinners(players, winningNumber)
        });
    })

    it('Guess algo outcome', () => {
        var results = {
            1:0,
            2:0,
            3:0,
            4:0,
            5:0,
            6:0,
            7:0,
            8:0,
            9:0
        }

        for (let i = 0; i < 100000; i++) {
            var result = game.guessAlgo()
            results[result] += 1
        }

        // 1: 1/45
        // 2: 2/45
        // 3: 3/45
        // 4: 4/45
        // 5: 5/45
        // 6: 6/45
        // 7: 7/45
        // 8: 8/45
        // 9: 9/45
        var thresholds = {
            1: [minThreshold(1), maxThreshold(1)],
            2: [minThreshold(2), maxThreshold(2)],
            3: [minThreshold(3), maxThreshold(3)],
            4: [minThreshold(4), maxThreshold(4)],
            5: [minThreshold(5), maxThreshold(5)],
            6: [minThreshold(6), maxThreshold(6)],
            7: [minThreshold(7), maxThreshold(7)],
            8: [minThreshold(8), maxThreshold(8)],
            9: [minThreshold(9), maxThreshold(9)]
        }

        for(var number in thresholds) {
            var min = thresholds[number][0]
            var max = thresholds[number][1]
            expect(results[number]).to.greaterThan(min)
            expect(results[number]).to.lessThan(max)
        }
    })
})  