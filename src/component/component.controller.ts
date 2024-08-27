import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller(':projectId/:pageId/components')
export class ComponentController {
    constructor(private readonly componentService: ComponentService) {}

    @Post()
    async addComponent(
        @Req() req,
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Body() createComponentDto: CreateComponentDto,
    ): Promise<any> {
        const userId = req.user.userId;
        return this.componentService.addComponent(userId, projectId, pageId, createComponentDto);
    }

}
