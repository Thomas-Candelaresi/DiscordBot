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
var classes = [];
var wrongWeaponCommand = "Meeeeh, you didn't quite use it right mate. \n" +
    "How to use the weapon command :" +
    "\n!weapon nickname [weapon]" +
    "\n- nickname: nickname to be displaying the weapon loadouts." +
    "\n- weapon: weapon model to consult the loadout. Ex : M13. If not precised, lists all the weapons for the specified nickname.";
var userNotExist = "Meeeeh, I see no loadout for that nickname. ¯\_(ツ)_/¯";
var weaponNotExist = "Meeeeh, I see no such weapon for that nickname. ¯\_(ツ)_/¯"

var weaponFunctionInCorrect = function(args) {
    if (args.length < 1 || args.length > 2)
        return wrongWeaponCommand;
    if(classes[args[0]] == null)
        return userNotExist;
    if(args.length > 1 && classes[args[0]][args[1]] == null)
    return null;
}

var weaponCommand = function(message, args) {
    logger.debug("classes contain:" + classes);
    var messageIfError = weaponFunctionInCorrect(args);
    if(messageIfError != null) {
        message.reply(messageIfError);
        logger.debug("Call of weapon command with the wrong parameters :" + args);
        logger.debug("classes contain:" + classes);
        return;
    }
    var response = classes[args[0]];
    if(args.length > 1){
        response = response[args[1]];
    }
    message.reply(response);
};

var addWeapon = function(message, args) {
    logger.debug("classes contain:" + classes);
    if(classes[args[0]] == null) {
        logger.debug("added " + args[0] + " to classes.");
        classes[args[0]] = {};
    }
        
    if(classes[args[0]][args[1]] != null) {
        message.reply("Not good mate :(");
    }
    classes[args[0]][args[1]] = args[2];
    logger.debug("classes contain:" + classes);
    message.reply("All good mate!");
}

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

    logger.debug(message.content);
    logger.debug(command);
    switch(command) {
        case "ping":
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;
        case "help":
            message.reply('List of available commands : \n!ping - evaluates your ping to the server. \n!help - provides the list of available commands.');
            break;
        case "weapon":
            logger.debug("weapon");
            logger.debug("command: " + command + ", parameters: " + args);
            weaponCommand(message, args);
            break;
        case "addweapon":
            logger.debug("addWeapon");
            logger.debug("command: " + command + ", parameters: " + args);
            addWeapon(message, args);
            break;
    }
});



bot.login(config.BOT_TOKEN);