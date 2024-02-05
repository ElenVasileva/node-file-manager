import path from 'path'

const upCommand = 'up'
const cdCommand = 'cd '
const lsCommand = 'ls'

import { pathExists, dirList, direntComparer, getDirentType } from './fsHelper.js'

const goUp = (currentDirectory) => {
    return path.dirname(currentDirectory)
}

const goInto = async (currentDirectory, input) => {
    const inputPath = input.substring(cdCommand.length)
    const newPath = path.resolve(currentDirectory, inputPath)
    if (await pathExists(newPath)) {
        return newPath
    } else {
        return undefined
    }
}

const showList = async (currentDirectory) => {
    const dirents = await dirList(currentDirectory)
    const table = dirents.map((dirent) => { return { Name: dirent.name, Type: getDirentType(dirent) } }).sort(direntComparer)
    console.table(table)
}

export { upCommand, cdCommand, lsCommand, goUp, goInto, showList }