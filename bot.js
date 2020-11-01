const _discord = require("discord.js");
var _logger = require('winston');
var config = require("./config.json");
var weapons = require("./weapons.json");
var _token = null;
try {
    _token = require("./token.json");
} catch (error) { }

// Configure logger settings
_logger.remove(_logger.transports.Console);
_logger.add(new _logger.transports.Console, {
    colorize: true
});
_logger.level = 'debug'

const prefix = "!";
const bot = new _discord.Client();
var classes = [];
var wrongWeaponCommand = "Meeeeh, you didn't quite use it right mate. \n" +
    "How to use the weapon command :" +
    "\n!weapon nickname [weapon]" +
    "\n- nickname: nickname to be displaying the weapon loadouts." +
    "\n- weapon: weapon model to consult the loadout. Ex : M13. If not precised, lists all the weapons for the specified nickname.";
var userNotExist = "Meeeeh, I see no loadout for that nickname. ¯\_(ツ)_/¯";
var weaponNotExist = "Meeeeh, I see no such weapon for that nickname. ¯\_(ツ)_/¯"

var weaponFunctionInCorrect = function (args) {
    if (args.length < 1 || args.length > 2)
        return wrongWeaponCommand;
    if (classes[args[0]] == null)
        return userNotExist;
    if (args.length > 1 && classes[args[0]][args[1]] == null)
        return null;
}

var weaponCommand = function (message, args) {
    _logger.debug("classes contain:" + classes);
    var messageIfError = weaponFunctionInCorrect(args);
    if (messageIfError != null) {
        message.reply(messageIfError);
        _logger.debug("Call of weapon command with the wrong parameters :" + args);
        _logger.debug("classes contain:" + classes);
        return;
    }
    var response = classes[args[0]];
    if (args.length > 1) {
        response = response[args[1]];
    }
    message.reply(response);
};

var addWeapon = function (message, args) {
    _logger.debug("classes contain:" + classes);
    if (classes[args[0]] == null) {
        _logger.debug("added " + args[0] + " to classes.");
        classes[args[0]] = {};
    }

    if (classes[args[0]][args[1]] != null) {
        message.reply("Not good mate :(");
    }
    classes[args[0]][args[1]] = args[2];
    _logger.debug("classes contain:" + classes);
    message.reply("All good mate!");
}

var muteToggle = function (message, isMute) {
    _logger.debug("member: " + message.member);
    _logger.debug("voice: " + message.member.voice);
    _logger.debug("channel: " + message.member.voice.channel);
    if (message.member.voice.channel) {
        let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
        for (const [memberID, member] of channel.members) {
            member.voice.setMute(isMute);
        }
    } else {
        _logger.info('You need to join a voice channel first!');
    }
}

bot.on('ready', () => {
    _logger.info("Salut c'est Bob. Prêt à casser des culs!");
    var test = bot.channels;
});

bot.on("message", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    _logger.debug(message.content);
    switch (command) {
        case "ping":
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
            break;
        case "help":
            message.reply('List of available commands : \n!ping - evaluates your ping to the server. \n!help - provides the list of available commands.');
            break;
        case "weapon":
            _logger.debug("weapon");
            _logger.debug("command: " + command + ", parameters: " + args);
            weaponCommand(message, args);
            break;
        case "addweapon":
            _logger.debug("addWeapon");
            _logger.debug("command: " + command + ", parameters: " + args);
            addWeapon(message, args);
            break;
        case "muteChannel":
            _logger.debug("dans mute case");
            muteToggle(message, true);
            break;
        case "unmuteChannel":
            muteToggle(message, false);
            break;
    }
});

token = (config.dev_env ? _token.BOT_TOKEN : process.env.BOT_TOKEN);
bot.login(token);

