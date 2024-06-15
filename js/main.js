let forestCode = '';
let forestTimer = null;

$(document).ready(() => {
    var audio = document.createElement("AUDIO")
    document.body.appendChild(audio);
    audio.src = "./sounds/alert.mp3";
    
    const {showCodeCommand, setCodeCommand, orientation} = config;
    const user = config.user;
    document.documentElement.style.setProperty('--font-size', config.fontSize + 'px');
    document.documentElement.style.setProperty('--border-radius', config.borderRadius + 'px');
    console.log('document ready!')
    
    const commandDiv = $(`<div class="d-flex align-items-center justify-content-center ${orientation === "right" ? "left" : "right"}" id="forest-command">${showCodeCommand}</div>`);
    const codeDiv = $(`<div class="d-flex position-relative align-items-center justify-content-center ${orientation}" id="forest-code"><span></span><img class="position-absolute opacity-0" id="qr-code" /></div>`)
    
    if (orientation === 'right') {
        $("#main-container").prepend(commandDiv);
        $("#main-container").append(codeDiv);
    } else if (orientation === 'left') {
        $("#main-container").append(commandDiv);
        $("#main-container").prepend(codeDiv);
    }
    const opts = {
        channels: [user.channel]
    };
    const client = new tmi.client(opts);
    function showForest() {
        $('#forest-code img').removeClass('opacity-0');
        if (config.playSound) {
            audio.play();
        }
        forestTimer = setTimeout(() => {
            $('#forest-code img').addClass('opacity-0');
            clearTimeout(forestTimer);
            forestTimer = null;
        }, 15000);
    }
    client.on('message', (target, context, msg, self) => {
        let messageSplit = msg.trim().split(' ');
        let command = messageSplit[0].toLowerCase();
        if ([showCodeCommand, setCodeCommand].includes(command)) {
            if (command === showCodeCommand) {
                if (forestCode && forestCode.length && !forestTimer) {
                    showForest();
                }
            }
            let senderId = context['display-name'].toLowerCase();
            if (context.mod || (context['badges-raw'] != null && context['badges-raw'].startsWith('broadcaster'))) {
                if (command === setCodeCommand) {
                    console.log([messageSplit, command])
                    let code = messageSplit.slice(1).join(' ');
                    if (code 
                        // && code.length === 9
                    ) {
                        forestCode = code.toUpperCase();
                        $('#forest-code span').text(forestCode);
                        $('#forest-code #qr-code').attr('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://forestapp.cc/join-room/?token=${forestCode}&bgcolor=E3FF99&color=724406&margin=10`)
                    }
                    if (forestTimer) {
                        clearTimeout(forestTimer);
                        forestTimer = null;
                    }
                    showForest();
                }
            }
        }
    });
    client.connect();
})