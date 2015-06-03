#!/usr/bin/env node

var base64_module = require('./')

var help = false
var dashdash = false
var args = process.argv.slice(2).filter(function (arg) {
    if (dashdash)
        return !!arg
    else if (arg === '--')
        dashdash = true
    else if (arg.match(/^(-+|\/)(h(elp)?|\?)$/))
        help = true
    else
        return !!arg
});

if (help || args.length === 0) {
    // If they didn't ask for help, then this is not a "success"
    var log = help ? console.log : console.error
    log('Usage: recursive-base64 <path>')
    log('')
    log('  Recursive walk through directories and inline all css images to base64.')
    log('')
    log('Options:')
    log('')
    log('  -h, --help    Display this usage info')
    process.exit(help ? 0 : 1)
} else {
    args.forEach(function (arg) {
        base64_module.sync(arg)
    })
}
