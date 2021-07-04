import { httpPost } from './utils';
import { url } from './config';

export function getAccountBalance(account: string, successCallback: any, failureCallback: any) {
    var body = {
        "action": "account_balance",
        "account": account
    }
    httpPost(url, body, successCallback, failureCallback)
}

export function getAccountBlockCount(account: string, successCallback: any, failureCallback: any) {
    var body = {  
        "action": "account_block_count",
        "account": account
    }

    httpPost(url, body, successCallback, failureCallback)
}

export function getAccountHistory(account: string, count: number, successCallback: any, failureCallback: any) {
    var body = {  
        "action": "account_history",
        "account": account,
        "count": count.toString()
    }

    httpPost(url, body, successCallback, failureCallback)
}

export function sendPayments(wallet: string, fromAccount: string, accounts: string[], payment: BigInt, successCallback: any, failureCallback: any) {
    accounts.forEach(account => {
        sendPayment(wallet, fromAccount, account, payment, successCallback, failureCallback)
    });
}

export function sendPayment(wallet: string, fromAccount: string, account: string, payment: BigInt, successCallback: any, failureCallback: any) {
    var body = {
        "action": "send",
        "wallet": wallet,
        "source": fromAccount,
        "destination": account,
        "amount": payment.toString()
    }

    httpPost(url, body, successCallback, failureCallback)
}