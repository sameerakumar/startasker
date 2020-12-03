module.exports.generateOTP =  function generateOTP() {
        var text = "";
        var possible = "0123456789";
        for (var i = 0; i < 4; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        console.log('pin:' + text);
        return text;
    }
