var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var rn = require('random-number');



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.username);
    logger.info('www.discordapp.com/oauth2/authorize?&client_id=' + bot.id + '&scope=bot');
});





bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    //logger.debug("echo: " + message);

    //logger.debug(message.substring(0,1) == "!")

    if (message.substring(0, 1) == '!') {

        //logger.debug(message.substring(1).split(' '));

        //Basic command
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        //logger.debug("cmd d --> " + cmd);
        //logger.debug(cmd.substring(0,1) == "d");

        //Checking dice command
        if (cmd.substring(0,1) == "d") {

            var dice = args[0];

            aux = dice.substring(1).split('d')
            //logger.debug(aux);

            args[0] = aux[0];


            // Check if dice is valid
            if (is_numeric(aux[0])){
                if (aux[0] <= 0){
                    return
                }
            }else{
                return
            }

            //Correct d command
            args.splice(0, 0, "d");
            cmd = args[0]
        }

        //logger.debug(args);
        
        //logger.debug("cmd: " + cmd);

        var msg = ""
       

        // Handle commands
        switch(cmd) {

            // Sum command
            case 'sum':
                return;
                //roll_dice(args);
            break;

            // Dice roll command
            case 'd':
                var dice = args[1];
                var result = ""

                //Roll dice function, return rolled value
                function roll(){
                    var n = roll_dice(dice);
                    result += "\nd" + dice + " = " + n
                    return n
                }

                // Handle 
                if (args.length >= 4 && is_numeric(args[3]) ){
                    
                    var dices_number = args[3];
                    var sum = 0
                    var n_passed = 0
                    var th = 0

                    if(args.length >= 5 && is_numeric(args[4])){
                        if(args[4] > 0){
                            th = args[4]
                        }
                    }

                    for(var i = 0; i < dices_number; i++){
                        var rolled = roll();
                        sum += rolled;

                        if (th > 0){
                            if(rolled >= th){
                                n_passed += 1;
                            }
                        }
                    }

                    var threshold = ""

                    if(th > 0){
                        threshold = "\t passed: " + n_passed;
                    }

                    //logger.debug(sum);
                    result += "\n\ntotal: " + sum + threshold

                }else{
                    roll();
                }

                msg = result
            break;    
         }

        bot.sendMessage({
            to: channelID,
            message: emoje("dice") +  "<@" + userID + ">" + " rolou os dados " + msg
        });
     }
});


function roll_dice(dice){

    var min = Math.ceil(1);
    var max = Math.floor(dice);

    var options = {
        min:  min
      , max:  max
      , integer: true
      }

    //var number = Math.floor(Math.random() * (max - min + 1)) + min;

    var number = rn(options) // Used for more randomness

    return number;
}




//Emoji translate
function emoje(str){

    var em = ""

    switch(str) {
        
        case ':D':
            em = ':smile:'
        break;

        case ':P':
            em = ':stuck_out_tongue_winking_eye:'
        break;

        case 'dice':
            em = ':game_die:'
        break;
     }

     em = " " + em + " "

     return em;
}

function is_numeric(str){
    return /^\d+$/.test(str);
}