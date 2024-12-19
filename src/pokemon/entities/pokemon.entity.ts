import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

// Le tenemos que especificar un decorador llamado Schemas
// Para indenficar que es un Schemas
@Schema()
// Cuando extendemos de Document le estamos añadiendo todas las funcionalidades
// Necesarias de un Document de Mongo
export class Pokemon extends Document{

    // id: string // Mongo me lo da automatico

    // Prop: Aqui indicamos las propiedades de los atributos
    @Prop ({
        unique: true,
        index: true
    })
    name: string;

    @Prop ({
        unique: true,
        index: true
    })
    no: number;
}

// Le estamos indicando que cree un schemas a partir de una clase
export const PokemonSchemas = SchemaFactory.createForClass( Pokemon );