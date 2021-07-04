import { expect } from 'chai';
import * as utils from '../src/utils';
import * as types from '../src/types';
import * as stats from '../src/stats';

// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import 'mocha';


describe('Stats tests', () => {
  it('Current player from block test valid amount', () => {
    var block = {
        "type": "receive",
        "amount": "100000000000000000000000000000",
        "account": "ban_abc"
    }

    var player = stats.currentPlayerFromBlock(block)
    
    expect(player.account).to.equal(block.account)
    expect(player.number).to.equal(1)
  })

  it('Current player to small amount', () => {
    var block = {
        "type": "receive",
        "amount": "420",
        "account": "ban_abc"
    }

    var player = stats.currentPlayerFromBlock(block)
    expect(player).to.equal(null)
  })

  it('Current player to invalid amount', () => {
    var block = {
        "type": "receive",
        "amount": "100000000000000000000000000008",
        "account": "ban_abc"
    }

    var player = stats.currentPlayerFromBlock(block)
    expect(player).to.equal(null)
  })

  it('Get all current players from block', () => {
    var blockOne = {
        "type": "receive",
        "amount": "100000000000000000000000000000",
        "account": "ban_abc"
    }

    var blockTwo = {
        "type": "receive",
        "amount": "100000000000000000000000000008",
        "account": "ban_xyz"
    }

    var blocks = [
        blockOne,
        blockTwo
    ]

    var players = stats.getCurrentPlayers(blocks)

    expect(players).to.deep.equals([{"account": "ban_abc", "number": 1}])
  })
})
