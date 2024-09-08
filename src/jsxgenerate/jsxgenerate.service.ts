import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';

@Injectable()
export class JSXGeneratorService {
  constructor(private readonly fileService: FileService) {}

  async generateAndSaveJsxFile(components: any[], jsxFilePath: string , pageName: string): Promise<void> {
    const jsxContent = this.generateJsxContent(components ,pageName);
    await this.fileService.uploadJsxFile(jsxContent, jsxFilePath);
  }

   generateJsxContent(components: any[] , pageName: string): string {
    const usedComponents = this.extractUsedComponents(components);
    const componentBody = components.map(comp => this.generateComponent(comp)).join('\n');
    
    return `
      import React from 'react';
      

      const ${pageName} = () => (
        <div>
          ${componentBody}
        </div>
      );

      export default ${pageName};
    `.trim();
  }
  private extractUsedComponents(components: any[]): string[] {
    const componentNames = components.map(comp => comp.type);
    return Array.from(new Set(componentNames));
  }

  private generateComponent(comp: any): string {
    const props = this.generateProps(comp.properties);
    const text = comp.properties.text || '';
    const selfClosingTags = ['img', 'input', 'br', 'hr'];
    const style = this.generateStyle(comp.properties); 
    if (selfClosingTags.includes(comp.type.toLowerCase())) {
      // return `<${comp.type}${props ? ' ' + props : ''} />`;
      return `<${comp.type} style={${style}} />`;
    }

    // return `<${comp.type}${props ? ' ' + props : ''}>${text}</${comp.type}>`;
    return `<${comp.type} style={${style}}>${text}</${comp.type}>`;
  }


  //   return text
  //     ? `<${comp.type}${props ? ' ' + props : ''}>${text}</${comp.type}>`
  //     : `<${comp.type}${props ? ' ' + props : ''} />`;
  // }

  private generateProps(properties: any): string {
    return Object.keys(properties || {})
      .filter(prop => prop !== 'text')
      .map(prop => `${prop}="${properties[prop]}"`)
      .join(' ');
  }
  private generateStyle(properties: any): string {
    const styleProperties: any = {};
    if (properties.color) styleProperties.color = `"${properties.color}"`;
    if (properties.backgroundColor) styleProperties.backgroundColor = `"${properties.backgroundColor}"`;
    if (properties.fontSize) styleProperties.fontSize = `"${properties.fontSize}"`;
    if (properties.width) styleProperties.width = `"${properties.width}"`;
    if (properties.height) styleProperties.height = `"${properties.height}"`;
    if (properties.padding) styleProperties.padding = `"${properties.padding}"`;
    if (properties.justifyContent) styleProperties.justifyContent = `"${properties.justifyContent}"`;
    if (properties.alignItems) styleProperties.alignItems = `"${properties.alignItems}"`;

    
    const styleObject = Object.entries(styleProperties)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `{ ${styleObject} }`; 
  }
}



    