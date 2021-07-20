
import { newRouter } from './routes';
import { stats } from './stats';
import { startGame } from './game'
import * as utils from './utils'
import { playTheGame } from './house'
import { boostGame } from './booster'

const PORT = 3000
// Every 1 mins
const GAME_INTERVAL =  utils.getGameInterval()
// Every 1 second
const STATS_INTERVAL = 1000 
// House players interval
const HOUSE_INTERVAL = 1000 * 5 
// Boost interval
const BOOST_INTERVAL = 1000 * 5

function main() {
    // Start the game
    startGame()
    setInterval(() => {
        startGame()
    }, GAME_INTERVAL);

    // Start fetching stats
    setInterval(() => {
        stats(utils.getAccount())
    }, STATS_INTERVAL);

    // Start the house players
    setInterval(() => {
        playTheGame()
    }, HOUSE_INTERVAL)

    // Run the router
    var app = newRouter()
    app.listen(PORT, () => {
        console.log(`server is listening on ${PORT}`);
    });

    // Run the game booster
    setInterval(() => {
        boostGame()
    }, BOOST_INTERVAL)
}

main()