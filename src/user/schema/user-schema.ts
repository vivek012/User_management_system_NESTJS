import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User  {
  @Prop(
    {required:true}
  )
  name!: string;

  @Prop({
    required:true,
    unique:true
  })
  email!:string

  @Prop({
    required:true,
    minlength:6
  })
  password!:string

  @Prop({
    enum:["user", "admin"],
    default: "user"
  })
  role!:string

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    required:true,
    default:false
  })
  isDeleted!:boolean
}

export const  UserSchema = SchemaFactory.createForClass(User)
