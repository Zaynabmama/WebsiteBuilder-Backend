const path = require('path');
const shell = require('shelljs');

const projectName = process.argv[2];
const pageName = process.argv[3];

if (!projectName || !pageName) {
  console.error('Project name and page name are required!');
  process.exit(1);
}

const jsxFilePath = path.join(__dirname, 'uploads', projectName, `${pageName}`);
const buildDir = path.join(__dirname, 'uploads', projectName, 'build');

// Ensure the build directory exists
shell.mkdir('-p', buildDir);

// Run Babel to compile the JSX file
const command = `npx babel ${jsxFilePath} --out-dir ${buildDir} --config-file ./babel.config.json`;
shell.exec(command, function(code, stdout, stderr) {
  if (code !== 0) {
    console.error('Babel compilation failed:', stderr);
    process.exit(code);
  }
  console.log('Babel compilation succeeded:', stdout);
});
