import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';  // Import the FileService

@Injectable()
export class JSXGeneratorService {
  constructor(private readonly fileService: FileService) {}

  async generateAndSaveJsxFile(components: any[], filename: string): Promise<void> {
    const jsxContent = this.generateJsxContent(components);
    await this.fileService.uploadJsxFile(`${filename}.jsx`, jsxContent);
  }

  private generateJsxContent(components: any[]): string {
    return `
import React from 'react';

const Page = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    ${components.map(comp => this.generateComponent(comp, 2)).join('\n    ')}
  </div>
);

export default Page;
    `;
  }

  private generateComponent(comp: any, indentLevel: number = 0): string {
    const props = this.generateProps(comp.properties);
    const children = comp.children 
      ? comp.children.map(child => this.generateComponent(child, indentLevel + 1)).join(`\n${' '.repeat(indentLevel * 2)}`)
      : comp.properties.text || '';

    return this.formatComponent(comp.type, props, children, indentLevel);
  }

  private generateProps(properties: any): string {
    return Object.keys(properties || {})
      .filter(prop => prop !== 'text' && prop !== 'children')
      .map(prop => this.generatePropString(prop, properties[prop]))
      .join(' ');
  }

  private generatePropString(prop: string, value: any): string {
    if (typeof value === 'object' && prop === 'style') {
      return `style={${JSON.stringify(value).replace(/"([^"]+)":/g, '$1:')}}`;
    }
    return `${prop}="${value}"`;
  }

  private formatComponent(type: string, props: string, children: string, indentLevel: number): string {
    const indent = ' '.repeat(indentLevel * 2);
    if (children) {
      return `${indent}<${type} ${props}>
${indent}  ${children}
${indent}</${type}>`;
    } else {
      return `${indent}<${type} ${props} />`;
    }
  }
}
