import { showWelcome, showPath } from './greeting.js'
import runManager from './runManager.js'

import os from 'os'

const fileManager = () => {
    showWelcome();
    showPath(os.homedir());
    runManager()
}

fileManager();