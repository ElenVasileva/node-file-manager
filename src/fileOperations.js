import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { parseTwoPaths } from './fsHelper.js'
import constants from './constants.js'


const catCommand = 'cat '
const addCommand = 'add '
const renameCommand = 'rn '
const copyCommand = 'cp '
const moveCommand = 'mv '
const removeCommand = 'rm '

const printFile = async (workPath, input) => {
    try {
        const inputPath = input.substring(catCommand.length)
        const fileName = path.join(workPath, inputPath)
        await pipeline(
            createReadStream(fileName),
            process.stdout, { end: false }
        );
        return ''
    }
    catch {
        return constants.operationFailedMessage
    }
};

const createFile = async (workPath, input) => {
    let fileDescriptor
    try {
        const inputPath = input.substring(catCommand.length)
        const fileName = path.join(workPath, inputPath);
        fileDescriptor = await fs.open(fileName, 'wx');
        await fs.writeFile(fileDescriptor, '')
        return ''
    }
    catch {
        return constants.operationFailedMessage
    }
    finally {
        await fileDescriptor?.close()
    }
};

const renameFile = async (workPath, input) => {
    try {
        const paths = parseTwoPaths(input.substring(renameCommand.length))
        if (paths) {
            const oldFilePath = path.join(workPath, paths.first)
            const newFilePath = path.join(workPath, paths.second)
            await fs.rename(oldFilePath, newFilePath)
            return ''
        }
        else {
            return constants.invalidInputMessage
        }
    }
    catch {
        return constants.operationFailedMessage
    }
};

const copyFile = async (workPath, input) => {
    try {
        const paths = parseTwoPaths(input.substring(renameCommand.length))
        if (paths) {
            const oldFilePath = path.join(workPath, paths.first)
            const newFilePath = path.join(workPath, paths.second)
            await pipeline(
                createReadStream(oldFilePath),
                createWriteStream(newFilePath),
            );
            return ''
        }
        else {
            return constants.invalidInputMessage
        }
    }
    catch {
        return constants.operationFailedMessage
    }
};

const moveFile = async (workPath, input) => {
    try {
        const paths = parseTwoPaths(input.substring(renameCommand.length))
        if (paths) {
            const oldFilePath = path.join(workPath, paths.first)
            const newFilePath = path.join(workPath, paths.second)
            await pipeline(
                createReadStream(oldFilePath),
                createWriteStream(newFilePath),
            );
            await fs.rm(oldFilePath)
            return ''
        }
        else {
            return constants.invalidInputMessage
        }
    }
    catch (error) {
        console.log(error)
        return constants.operationFailedMessage
    }
};

const removeFile = async (workPath, input) => {
    try {
        const inputPath = input.substring(removeCommand.length)
        const fileName = path.join(workPath, inputPath);
        await fs.unlink(fileName)
        return ''
    }
    catch {
        return constants.operationFailedMessage
    }
};

export {
    catCommand, addCommand, renameCommand, copyCommand, moveCommand, removeCommand,
    printFile, createFile, renameFile, copyFile, moveFile, removeFile
}