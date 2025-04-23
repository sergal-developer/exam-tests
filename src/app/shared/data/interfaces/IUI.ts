
export interface IHeader {
  type?: string;
  title?: string;
  avatar?: string,

  canEditTitle?: boolean;
  mainStyle?: string;
  mainClass?: string;
  headerClass?: string;

  //exam
  exam?: {
    questionsLenght?: number;
    progress?: string;
    current?: number;
    time?: any;
    completed?: boolean,
    color?: string,
    autoStartTimer?: boolean
  }
}
