const workflowModule = require('../core/workflows.js');
const stepModule = require('../core/steps.js');
const { ErrorHelper } = require('@borderline/utils');

/**
 * @fn WorkflowController
 * @desc Controller for workflow and step routes
 * @param mongoDBCollection_workflow Collection where the workflow are stored
 * @param mongoDBCollection_step Collection where the steps are stored
 */
function WorkflowController(mongoDBCollection_workflow, mongoDBCollection_step) {
    this.workflowCollection = mongoDBCollection_workflow;
    this.stepCollection = mongoDBCollection_step;

    this.workflow = new workflowModule(mongoDBCollection_workflow);
    this.step = new stepModule(mongoDBCollection_workflow, mongoDBCollection_step);

    this.getWorkflow = WorkflowController.prototype.getWorkflow.bind(this);
    this.putWorkflow = WorkflowController.prototype.putWorkflow.bind(this);
    this.getWorkflowByID = WorkflowController.prototype.getWorkflowByID.bind(this);
    this.postWorkflowByID = WorkflowController.prototype.postWorkflowByID.bind(this);
    this.deleteWorkflowByID = WorkflowController.prototype.deleteWorkflowByID.bind(this);
    this.getStep = WorkflowController.prototype.getStep.bind(this);
    this.putStep = WorkflowController.prototype.putStep.bind(this);
    this.getStepByID = WorkflowController.prototype.getStepByID.bind(this);
    this.postStepByID = WorkflowController.prototype.postStepByID.bind(this);
    this.deleteStepByID = WorkflowController.prototype.deleteStepByID.bind(this);
}

/**
 * @fn getWorkflow
 * @desc List all workflow on this server
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.getWorkflow = function (__unused__req, res) {
    this.workflow.findAll().then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(400);
        res.json(ErrorHelper('Failed to list workflows', error));
    });
};

/**
 * @fn putWorkflow
 * @desc Create a new workflow
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.putWorkflow = function (req, res) {
    let data = req.body;
    if (data === null || data === undefined) {
        res.status(400);
        res.json(ErrorHelper('Cannot create an empty workflow'));
        return;
    }

    data.user = req.user ? req.user._id : null;
    data.name = data.name ? data.name : 'DefaultWorkflowName';
    if (data.user === null || data.user === undefined) {
        res.status(401);
        res.json(ErrorHelper('Cannot create a workflow outside a session'));
        return;
    }

    this.workflow.createWorkflow(data).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(500);
        res.json(ErrorHelper('Failed to create workflow', error));
    });
};

/**
 * @fn getWorkflowByID
 * @desc Get a workflow from ID string
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.getWorkflowByID = function (req, res) {
    let workflow_id = req.params.workflow_id;
    this.workflow.getWorkflowByID(workflow_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot get workflow by ID', error));
    });
};

/**
 * @fn postWorkflowByID
 * @desc Update a workflow identified by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.postWorkflowByID = function (req, res) {
    let workflow_id = req.params.workflow_id;
    this.workflow.updateWorkflowByID(workflow_id, req.body).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot update workflow by ID', error));
    });
};

/**
 * @fn deleteWorkflowByID
 * @desc Delete a workflow referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.deleteWorkflowByID = function (req, res) {
    let workflow_id = req.params.workflow_id;
    this.workflow.deleteWorkflowByID(workflow_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot delete workflow by ID', error));
    });
};

/**
 * @fn getStep
 * @desc List all steps wihtin a workflow
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.getStep = function (req, res) {
    let workflow_id = req.params.workflow_id;
    this.step.getAll(workflow_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Listing workflow steps failed', error));
    });
};

/**
 * @fn putStep
 * @desc Create a step within a workflow
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.putStep = function (req, res) {
    if (req.body === null || req.body === undefined) {
        res.status(400);
        res.json(ErrorHelper('Cannot create an empty step'));
        return;
    }

    let data = {};
    data.workflow_id = req.params.workflow_id;
    data.step_data = req.body;
    data.user = req.user ? req.user._id : null;
    this.step.create(data).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(400);
        res.json(ErrorHelper('Creating workflow step failed', error));
    });
};

/**
 * @fn getStepById
 * @desc Get a step referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.getStepByID = function (req, res) {
    let step_id = req.params.step_id;
    this.step.getByID(step_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot get step', error));
    });
};

/**
 * @fn postStepByID
 * @desc Update a step referenced by ID. Update propagates to container workflow
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.postStepByID = function (req, res) {
    let workflow_id = req.params.workflow_id;
    let step_id = req.params.step_id;
    let step_data = req.body;
    let that = this;
    this.step.updateByID(step_id, step_data).then(function (step_result) {
        that.workflow.updateTimestamp(workflow_id).then(function (__unused__workflow_result) {
            res.status(200);
            res.json(step_result);
        }, function (workflow_error) {
            res.status(500);
            res.json(ErrorHelper('Logging update in workflow failed', workflow_error));
        });
    }, function (step_error) {
        res.status(400);
        res.json(ErrorHelper('Update step operation failed', step_error));
    });
};

/**
 * @fn deleteStepByID
 * @desc Removes a step. Update propagates through the parent workflow
 * @param req Express.js request object
 * @param res Express.js response object
 */
WorkflowController.prototype.deleteStepByID = function (req, res) {
    let step_id = req.params.step_id;
    let workflow_id = req.params.workflow_id;
    let that = this;
    this.step.deleteByID(step_id).then(function (result) {
        that.workflow.updateTimestamp(workflow_id).then(function (__unused__workflow_result) {
            res.status(200);
            res.json(result);
        }, function (workflow_error) {
            res.status(500);
            res.json(ErrorHelper('Logging delete in workflow failed', workflow_error));
        });
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Delete step operation failed', error));
    });
};

module.exports = WorkflowController;
