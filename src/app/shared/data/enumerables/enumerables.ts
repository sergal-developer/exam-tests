export enum EVENTS {
    CONFIG = 'config',
    SCREENS = 'screen'
}

export enum ScreenEnum {
    splash = 'splash',
    dashboard = 'dashboard',
    exam = 'exam',
    create = 'create',
    upload = 'upload',

    
    profile = 'profile',
    settings = 'settings',
    home = 'home',
    game = 'game',
    admin = 'admin'
}


export enum GamesEnum {
    ColorNumbers = 'ColorNumbers',
    Comparison = 'Comparison',
    ConnectDots = 'ConnectDots',
    Count = 'Count',
    FriendsNumbers = 'FriendsNumbers',
    Hanged = 'Hanged',
    MathematicsExam = 'MathematicsExam',
    Memory = 'Memory',
    Packages = 'Packages',
    Patterns = 'Patterns',
    Puzzle = 'Puzzle',
    ReadingSpeed = 'ReadingSpeed',
    WarOfWords = 'WarOfWords',
}

export enum OperationTypeEnum {
    addition = 'addition',
    subtraction = 'subtraction',
    multiplication = 'multiplication',
    division = 'division',
    mix = 'mix',
    words = 'words',
}

export enum GamesStatus {
    new = 'new',
    progress = 'progress',
    completed = 'completed',
}