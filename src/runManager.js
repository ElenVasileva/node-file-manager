import stream from 'stream';
import os from 'os'


import { showBye } from './greeting.js'
import { upCommand, cdCommand, lsCommand, goUp, goInto, showList } from './navigation&WorkingDirectory.js'
import {
    catCommand, addCommand, renameCommand, copyCommand, moveCommand, removeCommand,
    printFile, createFile, renameFile, copyFile, moveFile, removeFile
} from './fileOperations.js'
import { osCommand, getOsInfo } from './osInfoOperation.js';
import { calcHashCommand, compressCommand, decompressCommand, calculateHash, compress, decompress } from './hash&compress.js';
import constants from './constants.js';

let currentDirectory = os.homedir()

const exitCommand = '.exit'

const changeDirectory = async (input) => {
    const newPath = await goInto(currentDirectory, input)
    if (newPath) {
        currentDirectory = newPath
        return ''
    } else {
        return constants.operationFailedMessage
    }
}

const defineCommand = async (input) => {
    if (input === exitCommand) {
        showBye()
        process.exit(0)
    }

    // ---   NAVIGATION AND WORKING DIRECTORY   ---
    else if (input === upCommand) {
        currentDirectory = goUp(currentDirectory);
        return ''
    }

    else if (input.startsWith(cdCommand)) {
        return await changeDirectory(input)
    }

    else if (input === lsCommand) {
        await showList(currentDirectory)
        return ''
    }

    // ---   FILE OPERATIONS   ---
    else if (input.startsWith(catCommand)) {
        return await printFile(currentDirectory, input)
    }
    else if (input.startsWith(addCommand)) {
        return await createFile(currentDirectory, input)
    }
    else if (input.startsWith(renameCommand)) {
        return await renameFile(currentDirectory, input)
    }
    else if (input.startsWith(copyCommand)) {
        return await copyFile(currentDirectory, input)
    }
    else if (input.startsWith(moveCommand)) {
        return await moveFile(currentDirectory, input)
    }
    else if (input.startsWith(removeCommand)) {
        return await removeFile(currentDirectory, input)
    }

    //   ---   GET OS INFO OPERATIONS   ---
    else if (input.startsWith(osCommand)) {
        return getOsInfo(input)
    }

    //   ---   HASH
    else if (input.startsWith(calcHashCommand)) {
        return await calculateHash(currentDirectory, input)
    }

    //   ---   COMPRESS & DECOMPRESS
    else if (input.startsWith(compressCommand)) {
        return await compress(currentDirectory, input)
    }
    else if (input.startsWith(decompressCommand)) {
        return await decompress(currentDirectory, input)
    }
    return constants.invalidInputMessage
}

const runManager = () => {

    const transformStream = new stream.Transform({
        async transform(chunk, _, callback) {
            let output = ''
            try {
                output = await defineCommand(String(chunk).trim('\n'));
            }
            catch {
                output = constants.operationFailedMessage
            }
            output += `\nYou are currently in ${currentDirectory}> `
            callback(null, output);
        },
    });
    process.stdin.pipe(transformStream).pipe(process.stdout);
};

export default runManager