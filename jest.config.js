module.exports = {
    testRegex: '.*.[jt]sx?$',
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
}
