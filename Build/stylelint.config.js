/* eslint-disable no-undef */
"use strict"
/*
    Angepasste Stylelint-Config und -Regeln
    Übersicht aller Stylelint Regeln -> https://stylelint.io/user-guide/rules/list
*/
module.exports = { // eslint-disable-line no-undef
    "extends": [
        "stylelint-config-recommended", // contains these rules: https://github.com/stylelint/stylelint-config-recommended/blob/master/index.js
        "stylelint-config-recommended-scss", // contains these rules: https://github.com/kristerkari/stylelint-config-recommended-scss/blob/master/index.js
        "stylelint-config-standard" // contains these rules: https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
    ],
    "plugins": [
        "stylelint-scss", // see https://github.com/kristerkari/stylelint-scss
        "stylelint-order" // see https://github.com/hudochenkov/stylelint-order
    ],
    "ignoreFiles": ["**/*.html", "**/*.js"],
    "rules": {
        //"at-rule-empty-line-before": null, // ehem. setting aus der .stylelintrc.json
        "at-rule-empty-line-before": [
            "always", {
                "except": ["first-nested", "blockless-after-blockless"],
                "ignore": "after-comment"
            }],
        "at-rule-no-unknown": null,  // ehem. setting aus der .stylelintrc.json
        "scss/at-rule-no-unknown": true,
        "block-closing-brace-newline-after": "always-single-line", // ehem. setting aus der .stylelintrc.json
        //"declaration-block-no-shorthand-property-overrides": null, // ehem. setting aus der .stylelintrc.json
        "declaration-block-no-shorthand-property-overrides": true,
        "declaration-colon-newline-after": null, // ehem. setting aus der .stylelintrc.json
        "declaration-empty-line-before": null, // ehem. setting aus der .stylelintrc.json
        //"font-family-no-missing-generic-family-keyword": null, // ehem. setting aus der .stylelintrc.json
        "font-family-no-missing-generic-family-keyword": true,
        "function-comma-newline-after": null, // ehem. setting aus der .stylelintrc.json
        "function-parentheses-newline-inside": null, // ehem. setting aus der .stylelintrc.json
        "no-descending-specificity": null, // ehem. setting aus der .stylelintrc.json
        ////"no-descending-specificity": [true, {"severity": "warning"}], // bringt zumindest unter Win10 webpack zum crashen mit "Error: spawn ENAMETOOLONG"
        "number-leading-zero": "never", // ehem. setting aus der .stylelintrc.json
        //"selector-type-no-unknown": null // ehem. setting aus der .stylelintrc.json
        "selector-type-no-unknown": [true, {"severity": "warning"}],
        "property-no-vendor-prefix": [
            true, {
            ignoreProperties: ["backface-visibility", "appearance"]
        }]
    }
}
