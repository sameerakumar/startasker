var randomPassword = {
    getRandomPassword: function getPassword() {
    var text = ""; //random text
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    let password = text;
    return password;
}
}
module.exports = randomPassword;