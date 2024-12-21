import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {
  
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
    //private readonly pokemonService: PokemonService,
  ) {}

  async executeSeed() {
    
    await this.pokemonModel.deleteMany({})

    const  data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650")
      const pokemonInsert: { name: string, no: number }[] = []
    
    data.results.forEach(async({name, url}) => {
        const segments = url.split("/")
        const no: number = +segments[segments.length - 2 ];
        
        pokemonInsert.push({name, no})
        
        // const pokemon = await this.pokemonModel.create({name, no}) 

        // Forma hecha por mi
        // this.pokemonService.fillDataBases(name, no)
    })

    await this.pokemonModel.insertMany(pokemonInsert)

    return "Seed executed"
  }
}
