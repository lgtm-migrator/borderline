module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
        'indentation': 4,
        'color-hex-case': 'upper',
        'color-hex-length': 'long',
        'color-no-invalid-hex': true,
        'comment-empty-line-before': [
            'always',
            {
                'ignore': [
                    'stylelint-commands',
                    'after-comment'
                ]
            }
        ],
        'declaration-colon-space-after': 'always',
        'max-empty-lines': 1,
        'rule-empty-line-before': [
            'always',
            {
                'except': ['first-nested'],
                'ignore': ['after-comment']
            }
        ],
        'unit-whitelist': ['em', 'rem', '%', 's', 'ms']
    }
};
