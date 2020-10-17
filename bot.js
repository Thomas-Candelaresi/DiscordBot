const Discord = require("discord.js");
const config = require("./config.json");
var logger = require('winston');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug'

const prefix = "!";
const bot = new Discord.Client();


bot.on('ready', () => {
    logger.info("Salut c'est Bob. Prêt à casser des culs!");
    var test = bot.channels;
});

bot.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case "ping":
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;
        case "help":
            message.reply('List of available commands : \n!ping - evaluates your ping to the server. \n!help - provides the list of available commands.');
    }
    // if (command === "ping") {
    //     const timeTaken = Date.now() - message.createdTimestamp;
    //     message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    // }
});

bot.login(config.BOT_TOKEN);