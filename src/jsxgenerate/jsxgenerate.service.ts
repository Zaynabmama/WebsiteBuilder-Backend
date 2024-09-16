import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';

@Injectable()
export class JSXGeneratorService {
  constructor(private readonly fileService: FileService) {}

  async generateAndSaveJsxFile(components: any[], jsxFilePath: string, pageName: string): Promise<void> {
    const jsxContent = this.generateJsxContent(components, pageName);
    await this.fileService.uploadJsxFile(jsxContent, jsxFilePath);
  }

  generateJsxContent(components: any[], pageName: string): string {
    const componentsJsx = components.map(component => this.generateComponentJsx(component)).join('\n\n');
    return `
      import React from 'react';

      const ${pageName} = () => {
        return (
          <div>
            ${componentsJsx}
          </div>
        );
      }

      export default ${pageName};
    `;
  }

  generateComponentJsx(component: any): string {
    const { type, properties } = component;

    switch (type) {
      case 'navbar':
        return this.generateNavbarJsx(properties);
      default:
        return '<div>Unknown Component</div>';
    }
  }

  generateNavbarJsx(properties: any): string {
    const { backgroundColor, color, logo, links, flexDirection, justifyContent, alignItems } = properties;
    
    const linksJsx = links
      .map((link: any) => `<a href="${link.href}" style={{ color: '${color}' }}>${link.name}</a>`)
      .join('\n');

    return `
      <nav style={{
        backgroundColor: '${backgroundColor}', 
        color: '${color}', 
        display: 'flex', 
        flexDirection: '${flexDirection}', 
        justifyContent: '${justifyContent}', 
        alignItems: '${alignItems}', 
        padding: '10px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', marginRight: 'auto' }}>
          ${logo}
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          ${linksJsx}
        </div>
      </nav>
    `;
  }
}
