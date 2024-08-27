import { Controller } from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';

@Controller('page')
export class PageController {
    constructor(private readonly projectService: ProjectService) {}
}
