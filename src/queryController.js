var model = require('./models.js');

function QueryController(queryCollection) {
    this.collection = queryCollection;

    //Bind member functions to this instance
    this.getNewQuery = QueryController.prototype.getNewQuery.bind(this);
    this.postNewQuery = QueryController.prototype.postNewQuery.bind(this);
    this.getQueryById = QueryController.prototype.getQueryById.bind(this);
    this.putQueryById = QueryController.prototype.putQueryById.bind(this);
    this.deleteQueryById = QueryController.prototype.deleteQueryById.bind(this);
    this.executeQuery = QueryController.prototype.executeQuery.bind(this);
}


QueryController.prototype.getNewQuery = function(req, res) {
    var newQuery = Object.assign({}, model.queryModel);
    delete newQuery._id;

    this.collection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount == 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json({error: 'Insert a new query failed'});
        }
    }, function(error){
       res.status(501);
       res.json({ error: error });
    });
};

QueryController.prototype.postNewQuery = function(req, res) {
};

QueryController.prototype.getQueryById = function(req, res) {};
QueryController.prototype.putQueryById = function(req, res) {};
QueryController.prototype.deleteQueryById = function(req, res) {};
QueryController.prototype.executeQuery = function(req, res) {};


module.exports = QueryController;