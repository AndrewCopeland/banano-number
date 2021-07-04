import express from "express";
import * as core from "express-serve-static-core";
import * as utils from './utils';

export function newRouter(): core.Express {
    var app = express()
    app.get('/api/current/game-number', (req, res) => {
        res.send(utils.getCurrentGameNumber().toString());
    });
      
    app.get('/api/current/pot', (req, res) => {
        res.send(utils.getCurrentPot().toString());
    });
    
    app.get('/api/current/players', (req, res) => {
        res.send(utils.getCurrentPlayers());
    });
    
    app.get('/api/current/game-start', (req, res) => {
        res.send(utils.getCurrentGameStart().toString());
    });
    
    app.get('/api/last/players', (req, res) => {
        res.send(utils.getLastPlayers());
    });
    
    app.get('/api/last/winners', (req, res) => {
        res.send(utils.getLastWinners());
    });
    
    app.get('/api/last/pot', (req, res) => {
        res.send(utils.getLastPot().toString());
    });
    
    app.get('/api/last/winning-number', (req, res) => {
        res.send(utils.getLastWinningNumber().toString());
    });
    
    app.get('/api/last/history', (req, res) => {
    var history = utils.getGameHistory()
        res.send(JSON.stringify(history[history.length-1]));
    });
    
    app.get('/api/history', (req, res) => {
        res.send(JSON.stringify(utils.getGameHistory()));
    });

    app.get('/api/account', (req, res) => {
        res.send(JSON.stringify(utils.getAccount()));
    });

    return app
}
