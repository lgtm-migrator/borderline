import { of, concat } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export const actions = {

    dockToEAEAnalysisKeyCounting: () => ({
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
    }),

    dockToEAEAnalysisCoclustering: () => ({
        type: '@@extensions/eae/DOCK_ANALYSIS',
        analysis: {
            name: 'Coclustering',
            language: 'python',
            code: `
"""
Demonstration of coclustering.
"""

### IMPORTS
import sys
import pandas as pd

"""
From * Ailem M., Role F., Nadif M., Co-clustering Document-term Matrices by
Direct Maximization of Graph Modularity. CIKM 2015: 1807-1810
"""

import numpy as np
from sklearn.utils import check_random_state, check_array

class ClusterLabelling(object):
    """Contains cluster results"""

    def __init__(self):
        self.row_labels = None
        self.col_labels = None
        self.modularity = -np.inf
        self.modularities = []

    def __repr__(self):
        def label_str(lbls):
            if lbls:
                return ' '.join(['%d' % d for d in lbls[:4]]) + ' ...' if 4 < len(lbls) else ''
            else:
                return ''

        return 'ClusterLabelling (modularity: %s (%s), rows: [%s], cols: [%s])' % (
            self.modularity,
            ', '.join(['%.3f' % f for f in self.modularities]),
            label_str(self.row_labels),
            label_str(self.col_labels),
        )


class Cocluster(object):
    """
   Perform co-clustering by direct maximization of graph modularity

   Parameters:
      n_clusters : int, number of co-clusters to form
      max_iter : int, Maximum number of iterations
      n_init : int, Number of time algorithm will be run with different
        initializations. The final results will be the best output of \`n_init\`
        consecutive runs in terms of modularity.
      random_state : integer, random seed
      tol : float, tolerance with regards to modularity to declare convergence

   """

    def __init__(self, n_clusters=2, max_iter=20, n_init=1,
                 tol=1e-9, random_state=None):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.n_init = n_init
        self.tol = tol
        self.random_state = random_state

    def init_col_assignment(self, n_clusters, n_cols, random_state=None):
        """
      Create a random column cluster assignment matrix.

      Each row contains 1 in the column corresponding to the cluster where the
      processed data matrix column belongs, 0 elsewhere.

      Parameters:
         n_clusters: int
            Number of clusters
         n_cols: int
            Number of columns of the data matrix (i.e. number of rows of the
            matrix returned by this function)
         random_state : int or :class:\`numpy.RandomState\`, optional
            The generator used to initialize the cluster labels. Defaults to the
            global numpy random number generator.

      Returns:
         matrix: binary, of shape (\`\`n_cols\`\`, \`\`n_clusters\`\`) gives a 1 for
            cluster that col belongs to and 0 for all others.

      """

        random_state = check_random_state(random_state)
        W_a = random_state.randint(n_clusters, size=n_cols)
        W = np.zeros((n_cols, n_clusters))
        W[np.arange(n_cols), W_a] = 1
        return W

    def fit(self, X):
        """
      Parameters:
         X : numpy array or scipy sparse matrix, shape=(n_samples, n_features)
            Matrix to be analyzed
      """

        random_state = check_random_state(self.random_state)

        check_array(X, accept_sparse=True, dtype="numeric", order=None,
                    copy=False, force_all_finite=True, ensure_2d=True,
                    allow_nd=False, ensure_min_samples=self.n_clusters,
                    ensure_min_features=self.n_clusters,
                    warn_on_dtype=False, estimator=None)

        if type(X) == np.ndarray:
            X = np.matrix(X)

        X = X.astype(float)

        best_labels = ClusterLabelling()

        seeds = np.random.randint(np.iinfo(np.int32).max, size=self.n_init)

        # for each initialisation
        for s in seeds:
            new_labels = self.fit_single(X, s)
            if np.isnan(new_labels.modularity):
                raise ValueError("matrix may contain unexpected NaN values")

            # remember attributes corresponding to the best modularity
            # if the new one is better, update attributes
            if (new_labels.modularity > best_labels.modularity):
                best_labels.modularity = new_labels.modularity
                best_labels.modularities = new_labels.modularities
                best_labels.row_labels = new_labels.row_labels
                best_labels.col_labels = new_labels.col_labels

        return best_labels

    def fit_single(self, X, random_state):

        # holder for results
        curr_labels = ClusterLabelling()

        W = self.init_col_assignment(self.n_clusters, X.shape[1], random_state)
        Z = np.zeros((X.shape[0], self.n_clusters))

        # Compute the modularity matrix
        row_sums = np.matrix(X.sum(axis=1))
        col_sums = np.matrix(X.sum(axis=0))
        N = float(X.sum())
        indep = (row_sums.dot(col_sums)) / N

        # B is a numpy matrix
        B = X - indep

        curr_labels.modularities = []

        # Loop
        m_begin = float("-inf")
        change = True
        iteration = 0
        while change:
            change = False

            # Reassign rows
            BW = B.dot(W)
            for idx, k in enumerate(np.argmax(BW, axis=1)):
                # mark evrything in col 0 except for desired index
                Z[idx, :] = 0
                Z[idx, k] = 1

            # Reassign columns
            BtZ = (B.T).dot(Z)
            for idx, k in enumerate(np.argmax(BtZ, axis=1)):
                # mark evrything in col 0 except for desired index
                W[idx, :] = 0
                W[idx, k] = 1

            k_times_k = (Z.T).dot(BW)
            m_end = np.trace(k_times_k)
            iteration += 1
            if ((self.tol < np.abs(m_end - m_begin)) and
                    (iteration < self.max_iter)):
                curr_labels.modularities.append(m_end / N)
                m_begin = m_end
                change = True

        curr_labels.row_labels = np.argmax(Z, axis=1).tolist()
        curr_labels.col_labels = np.argmax(W, axis=1).tolist()
        curr_labels.modularity = m_end / N

        return curr_labels


########
# MAIN #
########

### CONSTANTS & DEFINES

DATA_PTH = open(sys.argv[1], 'r')

# this is what you have to do to get the header and the first col as row names
DATA_DF = pd.read_csv(DATA_PTH, header=0, index_col=0, sep='\\t')

### ANALYSIS ###

# need numpy matrix/array
DATA_MAT = DATA_DF.as_matrix()

# print(MIRNA_MAT[1])
cluster_alg = Cocluster()
res = cluster_alg.fit(DATA_MAT)

f = open('output/' + str(sys.argv[1]) + '.out', 'a')
f.write('modularity: ' + str(res.modularity) + '\\n')
f.write('modularities: ' + str(res.modularities) + '\\n')
f.write('col_labels: ' + str(res.col_labels) + '\\n')
f.write('row_labels: ' + str(res.row_labels))
f.close()

# print(res)
`
        }
    })
};

export const epics = {

    enclaveBoot:
        (action) => action.ofType('START')
            .pipe(mergeMap(() => concat(
                of(actions.dockToEAEAnalysisKeyCounting()),
                of(actions.dockToEAEAnalysisCoclustering()),
            ))),

    eaeBoot:
        (action) => action.ofType('@@extension/eae/STARTED')
            .pipe(mergeMap(() => concat(
                of(actions.dockToEAEAnalysisKeyCounting()),
                of(actions.dockToEAEAnalysisCoclustering()),
            )))

};

export const reducers = {
};

export default {
    actions,
    epics,
    reducers
};
