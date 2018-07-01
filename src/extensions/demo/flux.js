import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export const actions = {

    dockToEAEAnalysis: () => ({
        type: '@@extensions/eae/DOCK_ANALYSIS',
        analysis: {
            name: 'JSON key counting',
            language: 'python',
            code: `
import json
import sys

DATA_PTH = str(sys.argv[1])

with open(DATA_PTH, 'r') as data:
    line = str(data.read())
    json_transmart = json.loads(json.loads(line))

f = open('output/clinical.out', 'a')
f.write('json keys: ' + str(json_transmart.keys()) + '\\n')
f.write('Dimension Elements: ' + str(json_transmart['dimensionElements']) + '\\n')
f.write('That\\'s all Folks!')
f.close()
`
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => of(actions.dockToEAEAnalysis()))),

    eaeBoot:
        (action) => action.ofType('@@extension/eae/STARTED')
            .pipe(mergeMap(() => of(actions.dockToEAEAnalysis())))

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
