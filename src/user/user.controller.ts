import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';//controllers depends on services , service depent on dal
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {} //injected the user service , the controller class depend on userservice

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.userService.updateUser(id, updateUserDto);
} 
  @UseGuards( RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
  return this.userService.findUserById(id);
}
@UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  findAll() {
  return this.userService.findAllUsers();
  }
  @UseGuards( RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

 
  
}