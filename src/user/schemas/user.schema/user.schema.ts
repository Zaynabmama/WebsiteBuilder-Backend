import { Prop ,Schema, SchemaFactory} from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
class User extends Document {
    @Prop({required:true })
    name: string;

    @Prop({required:true ,unique: true})
    email: string;
    
    @Prop({required:true})
    password: string;
}



@Schema()
class Deployment extends Document{
    @Prop({required:true})
    status:string

    @Prop({required:true})
    url:string

    @Prop({default:Date.now})
    deployedAt: Date; 

}


@Schema()
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
@Schema()
class Page extends Document {
    @Prop({ required: true })
    name:string;
    
    @Prop({ required: true })
    jsxFilePath: string; 

    @Prop({type:[Component],default:[]})
    components: Component[];  // Embedding Component schema
}

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Page], default: [] })
  pages: Page[];

  @Prop({ type: Deployment })
  deployment: Deployment; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}


