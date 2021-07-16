import { expect } from 'chai';
import * as utils from '../src/utils';
import * as types from '../src/types';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import 'mocha';

describe('Persistence tests', () => {
  it('Current game pot should be 1', () => {
    utils.setCurrentPot(1)
    var currentPot = utils.getCurrentPot();
    expect(currentPot).to.equal(1);
  })

  it('Current players should be abc and 1', () => {
    var player: types.Player = {
      account: "abc",
      number: 1
    }

    utils.setCurrentPlayers([player])
    var currentPlayers = utils.getCurrentPlayers();
    expect(JSON.stringify(currentPlayers)).to.equal(JSON.stringify([player]));
  })

  it('Current players should be abc and 1', () => {
    var player: types.Player = {
      account: "abc",
      number: 1
    }

    utils.setCurrentPlayers([player])
    var currentPlayers = utils.getCurrentPlayers();
    expect(JSON.stringify(currentPlayers)).to.equal(JSON.stringify([player]));
  })

  it('Current game time should be now', () => {
    var dateTime = Date.now()
    utils.setCurrentGameTime(dateTime)
    expect(utils.getCurrentGameStart()).to.equal(dateTime)
  })

  it('Set and Get current game number', () => {
    var gameNumber = 5
    utils.setCurrentGameNumber(gameNumber)
    expect(utils.getCurrentGameNumber()).to.equal(gameNumber)
  })

  it('Set and Get last players', () => {
    var players = [
      {
        "account": "abc",
        "number": 1
      },
      {
        "account": "xyz",
        "number": 2
      }
    ]

    utils.setLastPlayers(players)
    expect(JSON.stringify(utils.getLastPlayers())).to.equal(JSON.stringify(players))
  })

  it('Set and get last winners', () => {
    var winners = [
      "abc",
      "xyz"
    ]
    utils.setLastWinners(winners)
    expect(utils.getLastWinners()).to.deep.equals(winners)
  })

  it('Set and get last winning number', () => {
    var winningNumber = 8
    utils.setLastWinningNumber(8)
    expect(utils.getLastWinningNumber()).to.equal(winningNumber)
  })

  it('Set and get last pot', () => {
    var lastPot = BigInt(30)
    utils.setLastPot(lastPot)
    expect(utils.getLastPot()).to.equal(lastPot)
  })

  it ('Set and get the current height', () => {
    var currentHeight = 42
    utils.setCurrentHeight(currentHeight)
    expect(utils.getCurrentHeight()).to.equal(currentHeight)
  })

  it ('Set and get roll over pot', () => {
    var currentRollOver = BigInt(42)
    utils.setRollOverPot(currentRollOver)
    expect(utils.getRollOverPot()).to.equal(currentRollOver)
  })

  it ('Set and get game wallet', () => {
    var wallet = "someidhere"
    utils.setWallet(wallet)
    expect(utils.getWallet()).to.equal(wallet)
  })

  it ('Set and get game account', () => {
    var account = "ban_xyzabc"
    utils.setAccount(account)
    expect(utils.getAccount()).to.equal(account)
  })

  it('Set append and get history', () => {
    var historyOne: types.History = {
      id: 1,
      pot: '10000000000000000',
      distribution: '10000000000000000',
      winning_number: 8,
      time_played: Date.now(),
      players: [
        {
          "account": "abc",
          "number": 8
        },
        {
          "account": "xzy",
          "number": 1
        }
      ],
      winners: [
        "abc"
      ]
    }

    var historyTwo: types.History = {
      id: 2,
      pot: '900000000000000000',
      distribution: '900000000000000000',
      winning_number: 1,
      time_played: Date.now(),
      players: [
        {
          "account": "abc",
          "number": 8
        },
        {
          "account": "xzy",
          "number": 1
        }
      ],
      winners: [
        "xyz"
      ]
    }

    utils.setGameHistory([])
    utils.appendGameHistory(historyOne)
    utils.appendGameHistory(historyTwo)

    expect(utils.getGameHistory()).to.deep.equals([historyOne, historyTwo])


  })

  it('Set and get game interval', () => {
    var interval = 5
    utils.setgameInterval(5)
    expect(utils.getGameInterval()).to.equal(interval)
  })
})
