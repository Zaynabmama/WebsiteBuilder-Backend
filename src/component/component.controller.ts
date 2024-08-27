import { Body, Controller, Param, Post } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Controller('userId/:projectId/:pageId/components')
export class ComponentController {
    constructor(private readonly componentService: ComponentService) {}

    @Post()
    async addComponent(
        @Param('userId') userId: string,
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Body() createComponentDto: CreateComponentDto,
    ): Promise<any> {}

}
