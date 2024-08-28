import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateComponentDto } from './dto/update-component.dto';

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
    @Patch(':projectId/:pageId/components/:componentId')
    async updateComponent(
        @Req() req,
        @Param('projectId') projectId: string,
        @Param('pageId') pageId: string,
        @Param('componentId') componentId: string,
        @Body() updateComponentDto: UpdateComponentDto,
    ): Promise<any> {
        const userId = req.user.userId;
        return this.componentService.updateComponent(userId, projectId, pageId, componentId, updateComponentDto);
    }

    @Get(':projectId/:pageId')
    async getComponents(
    @Req() req,
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    ): Promise<any> {
    const userId = req.user.userId;
    return this.componentService.getComponents(userId, projectId, pageId);
    }






}
