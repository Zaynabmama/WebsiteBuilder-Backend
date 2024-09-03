import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';

@Injectable()
export class JSXGeneratorService {
  constructor(private readonly fileService: FileService) {}

  async generateAndSaveJsxFile(components: any[], filename: string): Promise<void> {
    const jsxContent = this.generateJsxContent(components);
    await this.fileService.uploadJsxFile(jsxContent, filename);
  }

   generateJsxContent(components: any[]): string {
    return `
import React from 'react';

const Page = () => {
  return (
    <div>
${components.map(comp => this.generateComponent(comp, 4)).join('\n')}
    </div>
  );
};

export default Page;
    `.trim(); 
  }

  private generateComponent(comp: any, indentLevel: number = 0): string {
    const indent = ' '.repeat(indentLevel * 2);
    const props = this.generateProps(comp.properties);
    const text = comp.properties.text || '';

    return text
      ? `${indent}<${comp.type}${props ? ' ' + props : ''}>${text}</${comp.type}>`
      : `${indent}<${comp.type}${props ? ' ' + props : ''} />`;
  }

  private generateProps(properties: any): string {
    return Object.keys(properties || {})
      .filter(prop => prop !== 'text')
      .map(prop => this.generatePropString(prop, properties[prop]))
      .join(' ');
  }

  private generatePropString(prop: string, value: any): string {
    if (prop === 'style') {
      return `style={${this.formatStyleObject(value)}}`;
    }
    if (typeof value === 'boolean') {
      return value ? prop : '';
    }
    return `${prop}="${this.escapeString(value)}"`;
  }

  private formatStyleObject(styleObject: any): string {
    return `{${Object.entries(styleObject)
      .map(([key, value]) => `${this.camelCaseToJsx(key)}: '${value}'`)
      .join(', ')}}`;
  }

  private camelCaseToJsx(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private escapeString(value: string): string {
    return value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }
}
