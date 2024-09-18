import * as fs from 'fs';
import * as path from 'path';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PageGeneratorService {
  generateHtmlFilesForPages(projectName: string): void {
    const projectDirectory = path.resolve(process.cwd(), 'uploads', projectName);

    try {
      const files = fs.readdirSync(projectDirectory);

      files.forEach(file => {
        if (file.endsWith('.js')) {
          const fileNameWithoutExtension = path.basename(file, '.js');
          const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${fileNameWithoutExtension}</title>
            </head>
            <body>
                <div id="root"></div>
                <!-- Include React and ReactDOM -->
                <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
                <!-- Include the transpiled JavaScript file -->
                <script src="${file}"></script>
                <!-- Render the React component -->
                <script>
                  ReactDOM.render(
                    React.createElement(Page),
                    document.getElementById('root')
                  );
                </script>
            </body>
            </html>
          `;
          fs.writeFileSync(path.join(projectDirectory, `${fileNameWithoutExtension}.html`), htmlContent);
        }
      });
    } catch (error) {
      console.error('Error generating HTML files:', error.message);
      throw new InternalServerErrorException('Failed to generate HTML files');
    }
  }
}
