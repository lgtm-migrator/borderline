const ObjectID = require('mongodb').ObjectID;
const { ErrorHelper, Models } = require('@borderline/utils');

/**
 * @fn Workflows
 * @param workflowCollection MongoDb collection to sync against
 * @constructor
 */
function Workflows(workflowCollection) {
    this.workflowCollection = workflowCollection;

    this.findAll = Workflows.prototype.findAll.bind(this);
    this.createWorkflow = Workflows.prototype.createWorkflow.bind(this);
    this.updateTimestamp = Workflows.prototype.updateTimestamp.bind(this);
    this.getWorkflowByID = Workflows.prototype.getWorkflowByID.bind(this);
    this.updateWorkflowByID = Workflows.prototype.updateWorkflowByID.bind(this);
    this.deleteWorkflowByID = Workflows.prototype.deleteWorkflowByID.bind(this);
}

/**
 * @fn findAll
 * @desc Find all workflows on the server
 * @return {Promise} Resolves to an array of workflows sorted by descending update time on success
 */
Workflows.prototype.findAll = function () {
    let that = this;
    return new Promise(function (resolve, reject) {
        that.workflowCollection.find().sort({ update: -1 }).toArray().then(function (result) {
            if (result === null || result === undefined || result.length === 0)
                resolve([]);
            else
                resolve(result);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn createWorkflow
 * @param data JSON object describing the workflow
 * @return {Promise} Resolve to the create workflow
 */
Workflows.prototype.createWorkflow = function (data) {
    let that = this;

    let time = new Date();
    let workflowModel = Object.assign({}, Models.BL_MODEL_WORKFLOW, {
        name: data.name,
        create: time,
        update: time,
        owner: data.user
    });
    return new Promise(function (resolve, reject) {
        that.workflowCollection.insertOne(workflowModel).then(function (__unused__success) {
            resolve(workflowModel);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn updateTimestamp
 * @param workflow_id A reference to some workflow
 * @return {Promise} Resolves to the updated workflow
 */
Workflows.prototype.updateTimestamp = function (workflow_id) {
    let that = this;
    let time = new Date();
    return new Promise(function (resolve, reject) {
        that.workflowCollection
            .findOneAndUpdate({ _id: new ObjectID(workflow_id) }, { $set: { update: time } }, { returnOriginal: false })
            .then(function (success) {
                resolve(success);
            }, function (error) {
                reject(ErrorHelper(error));
            }
            );
    });
};

/**
 * @fn getWorkflowByID
 * @desc Retrieves a workflow from its unique identifier
 * @param workflow_id The reference to te workflow
 * @return {Promise} Resolves to the workflow on success
 */
Workflows.prototype.getWorkflowByID = function (workflow_id) {
    let that = this;
    return new Promise(function (resolve, reject) {
        that.workflowCollection.findOne({ _id: new ObjectID(workflow_id) }).then(function (result) {
            if (result === null || result === undefined)
                reject('No match for workflow with id ' + workflow_id);
            else
                resolve(result);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn updateWorkflowByID
 * @param workflow_id The unique identifier of the workflow to update
 * @param data The new workflow content
 * @return {Promise} Resolve to the update workflow on success
 */
Workflows.prototype.updateWorkflowByID = function (workflow_id, data) {
    let that = this;
    let time = new Date();
    return new Promise(function (resolve, reject) {
        delete data._id;
        delete data.create;
        delete data.owner;
        data.update = time;
        let updated_workflow = Object.assign({}, Models.BL_MODEL_WORKFLOW, data);
        that.workflowCollection.findOneAndUpdate({ _id: new ObjectID(workflow_id) }, { $set: updated_workflow }, { returnOriginal: false })
            .then(function (result) {
                if (result === null || result === undefined)
                    reject(ErrorHelper('Update failed for workflow with id ' + workflow_id));
                else
                    resolve(result.value);
            }, function (error) {
                reject(ErrorHelper(error));
            });
    });
};

/**
 * @fn deleteWorkflowByID
 * @desc Removes a workflow from the server
 * @param workflow_id The reference unique identifier to the workflow
 * @return {Promise} Resolves to the deelted workflow on success
 */
Workflows.prototype.deleteWorkflowByID = function (workflow_id) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this.workflowCollection.findOneAndDelete({ _id: new ObjectID(workflow_id) }).then(function (result) {
            if (result === null || result === undefined || result.value === null)
                reject(ErrorHelper('No match for workflow with id ' + workflow_id));
            else
                resolve(result.value);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

module.exports = Workflows;
