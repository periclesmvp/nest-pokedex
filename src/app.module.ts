import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './common/config/app.config';
import { JoiValidationSchema } from './common/config/joi.validation';

@Module({
  imports: [
    // Es importante la posicion donde se pone. Por ello hay que ponerlo al inicio sino no funciona
    ConfigModule.forRoot({
      // Con esta clase indicamos que si hay alguna variable que no esta definida en el .env
      // Va a utilizar la configuracion de la clase
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB, {
      // Para llamar a la base de  datos con un nombre para que no se llame test que es el nombre preterminado
      dbName: "pokemonsdb"
    }),
    
    PokemonModule,
    
    CommonModule,
    
    SeedModule
  ],
})
export class AppModule {}
