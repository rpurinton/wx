import 'dotenv/config';
import log from './log.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { getCurrentFilename } from './esm-filename.mjs';

/**
 * Loads and registers Discord commands from JSON files and their handlers.
 * @param {Object} options
 * @param {Object} [options.fsLib=fs] - File system library
 * @param {Object} [options.pathLib=path] - Path library
 * @param {Function} [options.fileURLToPathFn=fileURLToPath] - fileURLToPath function
 * @param {Function} [options.restClass=REST] - REST class
 * @param {Object} [options.routes=Routes] - Discord.js Routes
 * @param {string} [options.token=process.env.DISCORD_TOKEN] - Discord bot token
 * @param {string} [options.clientId=process.env.DISCORD_CLIENT_ID] - Discord client ID
 * @param {Object} [options.logger=log] - Logger instance
 * @param {string} [options.commandsDirName='commands'] - Commands directory name
 * @param {Function} [options.importFn] - Function to import handlers
 * @param {ImportMeta} [options.meta=import.meta] - import.meta for ESM compatibility
 * @param {string} [options.commandsDirOverride] - Override for commands directory (for testing)
 * @returns {Promise<Object>} Map of command names to handler functions
 */
export const loadAndRegisterCommands = async ({
    fsLib = fs,
    pathLib = path,
    fileURLToPathFn = fileURLToPath,
    restClass = REST,
    routes = Routes,
    token = process.env.DISCORD_TOKEN,
    clientId = process.env.DISCORD_CLIENT_ID,
    logger = log,
    commandsDirName = 'commands',
    importFn = (p) => import(p),
    meta = import.meta,
    commandsDirOverride 
} = {}) => {
    const __filename = getCurrentFilename(meta);
    const __dirname = pathLib.dirname(__filename);
    const commandsDir = commandsDirOverride || pathLib.join(__dirname, commandsDirName);
    const files = fsLib.readdirSync(commandsDir).filter(f => f.endsWith('.json'));
    const rest = new restClass({ version: '10' }).setToken(token);
    const commandDefs = [];
    const commands = {};
    for (const file of files) {
        try {
            const def = JSON.parse(fsLib.readFileSync(pathLib.join(commandsDir, file), 'utf8'));
            commandDefs.push(def);
            const cmdName = def.name;
            const handlerPath = pathLib.join(commandsDir, `${cmdName}.mjs`);
            if (fsLib.existsSync(handlerPath)) {
                try {
                    const mod = await importFn(handlerPath);
                    commands[cmdName] = mod.default;
                } catch (e) {
                    logger.warn(`Failed to load handler for ${cmdName}:`, e);
                }
            } else {
                logger.warn(`No handler found for command ${cmdName}`);
            }
        } catch (err) {
            logger.error(`Failed to load command definition for ${file}:`, err);
            continue;
        }
    }
    try {
        await rest.put(
            routes.applicationCommands(clientId),
            { body: commandDefs }
        );
        logger.debug('Registered commands: ' + Object.keys(commands).join(', '));
    } catch (error) {
        logger.error('Failed to register commands:', error);
    }
    return commands;
};
