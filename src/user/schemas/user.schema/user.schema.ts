import { Prop ,Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
class Deployment extends Document{
    @Prop({required:true})
    status:string

    @Prop({required:true})
    url:string

}


@Schema({timestamps: true})
class Component extends Document{
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
@Schema({timestamps: true})
class Page extends Document {
    @Prop({ required: true })
    name:string;
    
    @Prop({ required: true })
    jsxFilePath: string; 

    @Prop({type:[Component],default:[]})
    components: Component[];  // Embedding Component schema
}

@Schema({timestamps: true})
class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Page], default: [] })
  pages: Page[];

  @Prop({ type: Deployment })
  deployment: Deployment; 

}

export @Schema({timestamps: true})
class User extends Document {
    @Prop({required:true })
    name: string;

    @Prop({required:true ,unique: true})
    email: string;
    
    @Prop({required:true})
    password: string;
    
    @Prop({ type: [Project], default: [] })
    projects: Project[];  // Embedding Project schema
}
export const UserSchema = SchemaFactory.createForClass(User);