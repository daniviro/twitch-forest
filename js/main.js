let forestCode = '';
let forestTimer = null;

$(document).ready(() => {
    var audio = document.createElement("AUDIO")
    document.body.appendChild(audio);
    audio.src = "./sounds/alert.mp3";
    
    const user = config.user;
    document.documentElement.style.setProperty('--font-size', config.fontSize + 'px');
    document.documentElement.style.setProperty('--border-radius', config.borderRadius + 'px');
    console.log('document ready!')
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
        if (['!forest', '!setforest'].includes(command)) {
            if (command === '!forest') {
                if (forestCode && forestCode.length && !forestTimer) {
                    showForest();
                }
            }
            let senderId = context['display-name'].toLowerCase();
            if (senderId === user.channel) {
                if (command === '!setforest') {
                    let code = messageSplit.slice(1).join(' ');
                    if (code && code.length === 9) {
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