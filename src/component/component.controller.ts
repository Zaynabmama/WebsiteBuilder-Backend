import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('components')
export class ComponentController {
    constructor(private readonly componentService: ComponentService) {}

    @Post(':projectId/:pageId')
    async addComponent(
        @Req() req,
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Body() createComponentDto: CreateComponentDto,
    ): Promise<any> {
        const userId = req.user.userId;
        return this.componentService.addComponent(userId, projectId, pageId, createComponentDto);
    }
    @Delete(':projectId/:pageId/components/:componentId')
    async deleteComponent(
        @Req() req,
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Param('componentId') componentId: string,
    ): Promise<any> {
        const userId = req.user.userId;
        return this.componentService.deleteComponent(userId, projectId, pageId, componentId);
    }




}
