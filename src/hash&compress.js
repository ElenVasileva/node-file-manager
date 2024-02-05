import { pipeline } from 'stream/promises'
import { Transform } from 'stream'
import fs from 'fs'
import zlib from 'node:zlib'
import crypto from 'crypto';

import { parseTwoPaths, join } from './fsHelper.js'
import constants from './constants.js'

const calcHashCommand = 'hash '
const compressCommand = 'compress '
const decompressCommand = 'decompress '

const calculateHash = async (workPath, input) => {
    try {
        const inputPath = input.substring(calcHashCommand.length)
        const fileName = join(workPath, inputPath)
        const readableStream = fs.createReadStream(fileName)

        const hash = crypto.createHash('sha256')

        const transformStream = new Transform({
            transform(chunk, _, callback) {
                callback(null, hash.update(chunk).digest('hex'))
            },
        });
        await pipeline(
            readableStream,
            transformStream,
            process.stdout, { end: false }
        );
        return ''
    }
    catch {
        return constants.operationFailedMessage
    }
};

const compress = async (workPath, input) => {
    try {
        const paths = parseTwoPaths(input.substring(compressCommand.length))
        if (paths) {
            const toCompressPath = join(workPath, paths.first)
            const archivePath = join(workPath, paths.second)

            await pipeline(
                fs.createReadStream(toCompressPath),
                zlib.createBrotliCompress(),
                fs.createWriteStream(archivePath),
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
}

const decompress = async (workPath, input) => {
    try {
        const paths = parseTwoPaths(input.substring(decompressCommand.length))
        if (paths) {
            const archivePath = join(workPath, paths.first)
            const toDecompressPath = join(workPath, paths.second)

            await pipeline(
                fs.createReadStream(archivePath),
                zlib.createBrotliDecompress(),
                fs.createWriteStream(toDecompressPath),
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
}

export { calcHashCommand, compressCommand, decompressCommand, calculateHash, compress, decompress }