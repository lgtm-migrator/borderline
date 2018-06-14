import React, { Component } from 'react';
import Editor from 'components/Editor';

class StepStage extends Component {

    // Custom name for container
    static displayName = 'StepStage';

    render() {
        return (
            <Editor language="json" value={`\
{ 
 "uri": "/v2/observations?constraint=",
  "params": {
    "type": "combination", 
    "operator": "and", 
    "args": [
      {
        "type":"concept",
        "path":"\\\\Public Studies\\\\CATEGORICAL_VALUES\\\\Demography\\\\Gender\\\\Male\\\\"
      },
      {
        "type":"concept",
        "path":"\\\\Public Studies\\\\CATEGORICAL_VALUES\\\\Demography\\\\Gender\\\\Female\\\\"
      }]
   },
   "type": "clinical"
}
`} />
        );
    }
}

export default StepStage;
