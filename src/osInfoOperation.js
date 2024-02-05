import os from 'os'
import constants from './constants.js'

const osCommand = 'os '

const getOsInfo = (input) => {
    switch (input) {
        case 'os --EOL':
            return JSON.stringify(os.EOL)
        case 'os --cpus':
            const cpusInfo = os.cpus()
            console.table(cpusInfo.map(cpu => cpu.model))
            return `Amount of CPUS is ${cpusInfo.length}`
        case 'os --homedir':
            return os.homedir
        case 'os --username':
            return os.userInfo().username
        case 'os --architecture':
            return os.arch()
        default:
            return constants.invalidInputMessage
    }
}

export { osCommand, getOsInfo }