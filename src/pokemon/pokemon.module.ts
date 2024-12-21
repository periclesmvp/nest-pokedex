import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchemas } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    // Con esto estariamos indicando que importe el modulo de Mongoose
    // Y que de ese Modulo utilizamos el forFeature para indicar nuestro Modelo
    // Que se encuentra en nuestro entity 
    MongooseModule.forFeature([
      {
        // Indicamos el nombre de nuestra entity
        name: Pokemon.name,
        // Y nuestro schema 
        schema: PokemonSchemas ,
      }
    ])
  ],
  exports: [
    PokemonService,
    MongooseModule
  ]
})
export class PokemonModule {}
