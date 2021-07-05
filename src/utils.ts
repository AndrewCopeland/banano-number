import * as fs from 'fs';
import { History, Player } from './types';

const axios = require('axios').default;
const data_dir = "./data/"

const current_game_time = data_dir + "current-game-time"
const current_players_file = data_dir + "current-players"
const current_pot_file = data_dir + "current-pot" 
const current_height_file = data_dir + "current-height"

const last_players_file = data_dir + "last-players"
const last_pot_file = data_dir + "last-pot"
const last_winners_file = data_dir + "last-winners"
const last_winning_number_file = data_dir + "last-winning-number"
const current_game_number_file = data_dir + "game-number"

const game_history_file = data_dir + "history"
const roll_over_pot_file = data_dir + "roll-over"
const wallet_file = data_dir + "wallet"
const account_file = data_dir + "account"

function readFile(path: string): string {
    return fs.readFileSync(path,'utf8');
}

function writeFile(path: string, contents: string) {
    fs.writeFileSync(path, contents)
}

// Get functions
export function getCurrentPot(): number {
    return Number(readFile(current_pot_file))
}

export function getCurrentPlayers(): Player[] {
    return JSON.parse(readFile(current_players_file))
}

export function getCurrentGameStart(): number {
    return Number(readFile(current_game_time))
}

export function getCurrentGameNumber(): number {
    return Number(readFile(current_game_number_file))
}

export function getCurrentHeight(): number {
    return Number(readFile(current_height_file))
}

export function getLastPlayers(): any {
    return JSON.parse(readFile(last_players_file))
}

export function getLastWinners(): string[] {
    return JSON.parse(readFile(last_winners_file))
}

export function getLastPot(): BigInt {
    return BigInt(readFile(last_pot_file))
}

export function getLastWinningNumber(): number {
    return Number(readFile(last_winning_number_file))
}

export function getGameHistory(): History[] {
    return JSON.parse(readFile(game_history_file))
}

// Set functions
export function setCurrentPot(balance: number) {
    writeFile(current_pot_file, balance.toString())
}

export function setCurrentPlayers(players: Player[]) {
    writeFile(current_players_file, JSON.stringify(players))
}

export function setCurrentGameTime(time: number) {
    writeFile(current_game_time, time.toString())
}

export function setCurrentGameNumber(id: number) {
    writeFile(current_game_number_file, id.toString())
}

export function setCurrentHeight(height: number) {
    writeFile(current_height_file, height.toString())
}

export function setLastPlayers(players: Player[]) {
    writeFile(last_players_file, JSON.stringify(players))
}

export function setLastWinners(winners: string[]) {
    writeFile(last_winners_file, JSON.stringify(winners))
}

export function setLastWinningNumber(number: number) {
    writeFile(last_winning_number_file, number.toString())
}

export function setLastPot(balance: BigInt) {
    writeFile(last_pot_file, balance.toString())
}

export function setGameHistory(histories: History[]) {
    writeFile(game_history_file, JSON.stringify(histories))
}

export function appendGameHistory(history: History) {
    var histories = getGameHistory()
    histories.push(history)
    setGameHistory(histories)
}

export function setRollOverPot(rollOver: BigInt) {
    writeFile(roll_over_pot_file, rollOver.toString())
}

export function getRollOverPot() : bigint {
    return BigInt(readFile(roll_over_pot_file))
}

export function setWallet(wallet: string ) {
    return writeFile(wallet_file, wallet)
}

export function getWallet() {
    return readFile(wallet_file).trim()
}

export function setAccount(account: string) {
    return writeFile(account_file, account)
}

export function getAccount() {
    return readFile(account_file).trim()
}

// logging functions
export function logError(message: any) {
    console.log("ERROR: " + message)
}

export function log(message: string) {
    console.log("INFO: " + message)
}

// http functions
export function httpPost(address: string, body: any, successCallback: any, failureCallback: any) {
    const instance = axios.create({
        baseURL: address,
        timeout: 100000,
    });

    instance.post(address, body)
      .then(function (response) {
        if ('error' in response.data) {
            failureCallback(response)
            return
        }
        successCallback(response)
      })
      .catch(function (error) {
        failureCallback(error)
      });
}

// list functions
export function listContains(list, contains) {
    for(let i of list){
        if (i === contains) {
            return true
        }
    }

    return false
}

