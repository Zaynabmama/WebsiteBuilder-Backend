// import { Injectable } from '@nestjs/common';
// import * as path from 'path';
// import * as fs from 'fs-extra';
// import * as shell from 'shelljs';

// @Injectable()
// export class ReactAppService {
//   private readonly templatePath = path.join(__dirname, '../../react-app-template');
//   private readonly appDirectory = path.join(__dirname, '../../generated-apps');

//   async createReactApp(projectName: string, jsxFilePaths: string[]): Promise<string> {
    
//     const appPath = path.join(this.appDirectory, projectName);

    
//     console.log('Copying React template...');
//     await fs.copy(this.templatePath, appPath);

//     console.log('Injecting JSX files...');
//     for (const jsxFilePath of jsxFilePaths) {
//       const fileName = path.basename(jsxFilePath);
//       const destPath = path.join(appPath, 'src', 'pages', fileName);
//       await this.copyJsxFile(jsxFilePath, destPath);
//     }

//     console.log('Updating App.jsx...');
//     await this.updateAppJsx(appPath, jsxFilePaths.map(fp => path.basename(fp, '.jsx')));

    
//     console.log('Installing dependencies...');
//     shell.cd(appPath);
//     shell.exec('npm install', { silent: true });

//     console.log('React app generation completed.');
//     return appPath;
//   }

//   private async copyJsxFile(srcPath: string, destPath: string) {
//     try {
     
//       if (!(await fs.pathExists(srcPath))) {
//         throw new Error(`Source file does not exist: ${srcPath}`);
//       }
  
//       // Delay
//       await new Promise(resolve => setTimeout(resolve, 100));
  

//       const destDir = path.dirname(destPath);
//       await fs.ensureDir(destDir);
  
    
//       await fs.copyFile(srcPath, destPath);
//       console.log(`Successfully copied ${srcPath} to ${destPath}`);
//     } catch (error) {
//       console.error(`Failed to copy file from ${srcPath} to ${destPath}:`, error);
//       throw error;
//     }
//   }
  
  

//   private async updateAppJsx(appPath: string, pages: string[]): Promise<void> {
//     const importStatements = pages.map(page => `import ${page} from './pages/${page}';`).join('\n');
//     const routeStatements = pages.map(page => `<Route path="/${page}" component={${page}} />`).join('\n    ');

//     const appJsxContent = `
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// ${importStatements}

// const App = () => (
//   <Router>
//     <Switch>
//       <Route exact path="/" component={HomePage} />
//       ${routeStatements}
//     </Switch>
//   </Router>
// );

// export default App;
//     `;

//     await fs.writeFile(path.join(appPath, 'src', 'App.jsx'), appJsxContent);
//   }
// }
