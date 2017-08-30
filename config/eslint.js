module.exports = {

    "rules": {
        "no-alert": "error",
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "warn",
            "always"
        ],
        "indent": [
            "warn",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "spaced-comment": "warn",
        "space-in-parens": "warn",
        "space-unary-ops": "warn",
        "no-trailing-spaces": "warn",
        "no-unused-vars": [
            "error",
            {
                "vars": "all",
                "args": "all",
                "argsIgnorePattern": "^__unused__"
            }
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-var": [
            "error",
            "always"
        ],
        "no-irregular-whitespace": "error",
        // Following is due to https://github.com/facebookincubator/create-react-app/issues/2631
        "jsx-a11y/href-no-hash": "off",
        "jsx-a11y/anchor-is-valid": [
            "warn",
            {
                "aspects": [
                    "invalidHref"
                ]
            }
        ]
    }
}
