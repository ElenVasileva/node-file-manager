import { dirname } from 'path';
import { fileURLToPath } from 'url';

const extractUserName = () => {
    const argPrefix = '--username='

    const arg = process.argv[2];
    return arg.startsWith(argPrefix) ? arg.substring(argPrefix.length) : ''
}

const showWelcome = () => {
    console.log(`Welcome to the File Manager, ${extractUserName()}!`)
}

const showPath = (currentDirectory) => {
    console.log(`You are currently in ${currentDirectory}> `)
}

const showBye = () => {
    console.log(`Thank you for using File Manager, ${extractUserName()}, goodbye!`)
};

export { showWelcome, showPath, showBye }