const Discord = require("discord.js");
const config = require("./config.json");

const prefix = "!";

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log("Salut c'est Bob. Prêt à casser des culs!");
    var test = bot.channels;
});

bot.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
});

bot.login(config.BOT_TOKEN);