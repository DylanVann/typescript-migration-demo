import path from 'path'
import execa from 'execa'
import findYarnWorkspaceRoot from 'find-yarn-workspace-root'
import _ from 'lodash'

test('TypeScript errors are not increased', async () => {
    // Get root path of project, handling Windows backslashes.
    const root = path
        .resolve('./')
        .replace(new RegExp(_.escapeRegExp('\\'), 'g'), '/')

    // Run tsc in the root folder and get output.
    const getOutput = async () => {
        try {
            await execa('tsc', {
                cwd: path.join(__dirname, '..'),
            })
        } catch (e) {
            return e.stdout
        }
        console.log("You're done fixing the TypeScript errors!")
        return ''
    }

    // The output from our previous command.
    const output = await getOutput()

    // Get all the lines relevant to us.
    const relevantLines = output.split('\n')
        // Starting with our src path.
        .filter(v => v.startsWith('src/'))
        // Get rid of absolute paths.
        .map(v => v.replace(new RegExp(_.escapeRegExp(root), 'gm'), ''))
        // Strip line breaks.
        .map(v => v.replace(/\r?\n|\r/gm, ''))

    // Map filenames to arrays of errors.
    const errors = relevantLines.reduce((acc, line) => {
        const fileName = line.match(/(.*?)\(/)[1]
        const splitOn = ': error '
        const error = line.replace(fileName, '')
        return {
            ...acc,
            [fileName]: acc[fileName] ? acc[fileName].concat(error) : [error],
        }
    }, {})

    const totalErrors = relevantLines.length

    expect(totalErrors).toMatchSnapshot()
    expect(errors).toMatchSnapshot()
})
