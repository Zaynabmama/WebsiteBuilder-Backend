import { Prop ,Schema, SchemaFactory, } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({required:true })
    name: string;

    @Prop({required:true ,unique: true})
    email: string;
    
    @Prop({required:true})
    password: string;
}
export const UserSchema =SchemaFactory.createForClass(User);


@Schema()
export class deployment extends Document{
    @Prop({required:true})
    status:string

    @Prop({required:true})
    url:string

    @Prop({default:Date.now})
    deployedAt: Date; 

}
export const DeploymentSchema =SchemaFactory.createForClass(deployment);

@Schema()
export class Component extends Document{
    @Prop({required:true})
    type: string;
    @Prop({type:Object})
    properties:{
        color?: string;  //color property
        text?: string;  //text property
        x?: number;  //x-coordinate
        y?: number;  //y-coordinate
    };

}
export const ComponentSchema =SchemaFactory.createForClass(Component);