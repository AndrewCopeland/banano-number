
import { newRouter } from './routes';
import { stats } from './stats';
import { startGame } from './game'
import * as utils from './utils'

const PORT = 3000

function main() {
    // Start the game
    startGame()
    setInterval(() => {
        startGame()
    }, 1000 * 60 * 10);

    // Start fetching stats
    setInterval(() => {
        stats(utils.getAccount())
    }, 1000);

    // Run the router
    var app = newRouter()
    app.listen(PORT, () => {
        console.log(`server is listening on ${PORT}`);
    });
}

main()