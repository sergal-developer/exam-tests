import { ProfileEntity } from '../data/entities/entities';
import { GamesEnum, GamesStatus, OperationTypeEnum } from '../data/enumerables/enumerables';
import { Utils } from '../data/utils/utils';
import { LocalStorage } from './storage/localstorage';

export class GamesService {
  context = 'games';
  storage = new LocalStorage(this.context);
  utils = new Utils();

  constructor() {}

  getGames() {
    return this.convertItems(this.storage.getData(this.context));
  }

  saveGame(data: any) {
    return this.storage.saveInArray(data, data.userId, this.context);
  }

  bulkDefaultGames() {
    const levelsNumbers = [
      { level: 1, stars: 3, starsObtained: 0, type: OperationTypeEnum.addition, time: 4, status: GamesStatus.new },
      { level: 2, stars: 3, starsObtained: 0, type: OperationTypeEnum.subtraction, time: 4, status: GamesStatus.new },
      { level: 3, stars: 3, starsObtained: 0, type: OperationTypeEnum.addition, time: 4, status: GamesStatus.new },
      { level: 4, stars: 3, starsObtained: 0, type: OperationTypeEnum.subtraction, time: 4, status: GamesStatus.new },
      { level: 5, stars: 3, starsObtained: 0, type: OperationTypeEnum.multiplication, time: 4, status: GamesStatus.new },
      { level: 6, stars: 3, starsObtained: 0, type: OperationTypeEnum.division, time: 4, status: GamesStatus.new },
      { level: 7, stars: 3, starsObtained: 0, type: OperationTypeEnum.multiplication, time: 4, status: GamesStatus.new },
      { level: 8, stars: 3, starsObtained: 0, type: OperationTypeEnum.division, time: 4, status: GamesStatus.new },
      { level: 9, stars: 3, starsObtained: 0, type: OperationTypeEnum.mix, time: 4, status: GamesStatus.new },
      { level: 10, stars: 3, starsObtained: 0, type: OperationTypeEnum.mix, time: 4, status: GamesStatus.new },
    ];

    const levelsWords = [
      { level: 1, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 2, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 3, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 4, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 5, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 6, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 7, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 8, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 9, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
      { level: 10, stars: 3, starsObtained: 0, type: OperationTypeEnum.words, time: 4, status: GamesStatus.new },
    ];

    const games = [
      { id: GamesEnum.ColorNumbers, title: 'Colorear por números', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Comparison, title: 'Comparaciones', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.ConnectDots, title: 'Conecta puntos', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Count, title: 'Conteo', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.FriendsNumbers, title: 'Numeros Amigos', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Hanged, title: 'Ahorcado', stars: 0, starsTotal: 0, stages: levelsWords, image: 'svg' },
      { id: GamesEnum.MathematicsExam, title: 'Matematicas Frenesi', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Memory, title: 'Memoria', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Packages, title: 'Paqueteria', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Patterns, title: 'Patrones', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.Puzzle, title: 'Rompecabezas', stars: 0, starsTotal: 0, stages: levelsNumbers, image: 'svg' },
      { id: GamesEnum.ReadingSpeed, title: 'Lectura Rapida', stars: 0, starsTotal: 0, stages: levelsWords, image: 'svg' },
      { id: GamesEnum.WarOfWords, title: 'Guerra de Palabras', stars: 0, starsTotal: 0, stages: levelsWords, image: 'svg' },
    ];

    games.forEach((game) => {
      this.saveGame(game);
    });

    return this.getGames();
  }

  //#region CONVERTERS
  convertItems(list: Array<any> | null) {
    if ( !list ) { return null; }

    list.map((game) => {
      let listStarsObtained: number = 0;
      let listStarsTotal: number = 0;
      game.stages.map((stage: any) => {
        listStarsTotal = listStarsTotal + stage.stars;
        listStarsObtained = listStarsObtained + stage.starsObtained;
      });

      game.stars = listStarsObtained;
      game.starsTotal = listStarsTotal;
    });

    return list;
  }
  //#endregion
}
