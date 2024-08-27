import { Controller } from '@nestjs/common';
import { ComponentService } from './component.service';

@Controller('userId/:projectId/:pageId/components')
export class ComponentController {
    constructor(private readonly componentService: ComponentService) {}

}
