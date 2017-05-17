function ChatServerPlugin() {
    this.messages = [ ];
    this.getChat = ChatServerPlugin.prototype.getChat.bind(this);
    this.putChat = ChatServerPlugin.prototype.putChat.bind(this);
};

ChatServerPlugin.prototype.attach = function(expressAppRouter) {
    expressAppRouter.get('/chat', this.getChat);
    expressAppRouter.put('/chat', this.putChat);
};

ChatServerPlugin.prototype.detach = function() {
};

ChatServerPlugin.prototype.getChat = function(req, res) {
    var test_txt = borderline.fs.readFile('test.txt');
    console.log(test_txt.toString());

    res.status(200);
    res.json(this.messages);
};

ChatServerPlugin.prototype.putChat = function(req, res) {
    var msg = req.body;
    msg.date = new Date().toISOString();
    this.messages = this.messages.concat([msg]);
    res.status(200);
    res.json(msg);
};

module.exports = ChatServerPlugin;
