import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number

  constructor(
    // Y le indicamos con el decorador que el modelo va a ser Injectable
    @InjectModel(Pokemon.name)
    //Pasariamos como parametros al constructor el modelo con el que trabajamos en la base de datos
    private readonly pokemonModel: Model<Pokemon>,

    // Nos permite leer nuestro archivo de configuracion
    private readonly configService: ConfigService, 
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit')
   }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleException(error)
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select("-__v");
  }

  async findOne(term: string) {
    let pokemon: Pokemon

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }


    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim()
      })
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name, or no "${term}" not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);

      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

      // el new: true sirve para regresar el objeto actualizado
      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleException(error)
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne();

    const { deletedCount } = await this.pokemonModel.deleteOne({ "_id": id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with "${id}" not found`)
    }
    return deletedCount;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`The term "${JSON.stringify(error.keyValue)}" is duplicated`)
    }

    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check Server Logs`)
  }

  // Forma hecha por mi para hacer un seed en la base de datos

  // fillDataBases(name: string, no: number) {
  //   try {
  //     const pokemon: CreatePokemonDto = {name: name, no: no}

  //     this.pokemonModel.create( pokemon )
  //   }catch (error){
  //     this.handleException(error)
  //   }
  //   // this.create(pokemon)
  // }
}
