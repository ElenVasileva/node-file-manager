import fs from 'fs/promises';

const pathFraming = '"'

const pathExists = async (path) => {

    try {
        await fs.stat(path)
        return true;
    }
    catch {
        return false;
    }
}

const dirList = async (path) => {
    return await fs.readdir(path, { withFileTypes: true })
}

const direntComparer = (a, b) => {
    {
        if (a.Type < b.Type)
            return -1
        else if (a.Type > b.Type)
            return 1
        else if (a.Name < b.Name)
            return -1
        return 1;
    }
}

const getDirentType = (dirent) => {
    try {
        return dirent.isDirectory() ? 'directory' : 'file'
    }
    catch {
        return '---'
    }
}

const parseTwoPaths = (pathString) => {
    if (pathString.indexOf(pathFraming) >= 0) {
        const pathStringParts = pathString.split(pathFraming)
        if (pathStringParts.length === 5 && pathStringParts[0] === '' && pathStringParts[2] === ' ' && pathStringParts[4] === '') {
            return { first: pathStringParts[1], second: pathStringParts[3] }
        }
    }
    else if (pathString.indexOf(' ') > 0) {
        const pathStringParts2 = pathString.split(' ')
        if (pathStringParts2.length === 2) {
            return { first: pathStringParts2[0], second: pathStringParts2[1] }
        }
    }
    return undefined;
}

export { pathExists, dirList, direntComparer, getDirentType, parseTwoPaths }