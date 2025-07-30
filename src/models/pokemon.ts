export interface Stat {
  name: string;
  baseStat: number;
  effort: number;
}

export interface Sprite {
  frontDefault: string;
  backDefault: string;
  frontShiny: string;
  backShiny: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number;
  types: string[];
  abilities: string[];
  stats: Stat[];
  sprites: Sprite;
}
