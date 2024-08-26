import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
class Deployment {
    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    url: string;
}

@Schema({ timestamps: true })
class Component {
    @Prop({ required: true })
    type: string;

    @Prop({ type: Object })
    properties: {
        color?: string;
        text?: string;
        x?: number;
        y?: number;
    };
}

@Schema({ timestamps: true })
class Page {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    jsxFilePath: string;

    @Prop({ type: [Component], default: [] })
    components: Component[]; // Embedding Component schema
}

@Schema({ timestamps: true })
class Project {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [Page], default: [] })
    pages: Page[];

    @Prop({ type: Deployment })
    deployment: Deployment;
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
    role: string;

    @Prop({ type: [Project], default: [] })
    projects: Types.DocumentArray<Project>; // Embedding Project schema
}

export const UserSchema = SchemaFactory.createForClass(User);
