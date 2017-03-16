/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

import storylineEpics from './epics';

class StorylineExtension {

    identity() {
        return '0000-00-003';
    }

    invocation() {
        this.declareEpics(storylineEpics);
    }
}

export default StorylineExtension;
