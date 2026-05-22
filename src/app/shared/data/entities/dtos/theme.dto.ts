import { Column, generateTableFromClass } from "src/app/shared/services/database/sqlite.orm";

export class ThemeDTO {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ notNull: true, json: true })
    content!: string;
}

export const ThemeDTOScript = generateTableFromClass(ThemeDTO, 'theme_table');

export interface IThemeDTO {
  appBackground?: String;
  appColor?: String;
  appFontSize?: String;
  textFontSize?: String;

  primary?: String;
  primaryBackground?: String;
  primaryBackgroundHover?: String;
  primaryColor?: String;

  secondary?: String;
  secondaryBackground?: String;
  secondaryBackgroundHover?: String;
  secondaryBackgroundAlterHover?: String;
  secondaryColor?: String;

  accent?: String;
  accentBackground?: String;
  accentBackgroundHover?: String;
  accentColor?: String;

  scrollColor?: String;
  scrollBackground?: String;

  formErrorColor?: String;
  formBackground?: String;
  formBackgroundSolid?: String;

  notificationColor?: String;
  notificationColorContrast?: String;
  notificationSuccess?: String;
  notificationWarning?: String;
  notificationError?: String;
  notificationInfo?: String;

  gradeBackgroundPassed?: String;
  gradeColorPassed?: String;
  gradeBackgroundFailed?: String;
  gradeColorFailed?: String;
  gradeBackgroundBarely?: String;
  gradeColorBarely?: String;

  gradePanelPassed?: String;
  gradePanelFailed?: String;
  gradePanelBarely?: String;


  pillBackground?: String;
  pillColor?: String;
  rootHeroBackground?: String;
  timerBarBackground?: String;
  timerBarContainerBackground?: String;
  statusBackground?: String;

  answerBorderColor?: String;
  answerSelectedColor?: String;
  answerSelectedBackground?: String;
  answerCorrectColor?: String;
  answerCorrectColorText?: String;
  answerCorrectBorderColor?: String;
  answerCorrectBackground?: String;
  answerIncorrectColor?: String;
  answerIncorrectBackground?: String;
  answerIncorrectBorderColor?: String;

  grayBackdropBackground?: String;
  borderColorTransparent?: String;
  matLabelBackground?: String;
  matLabelContrastBackground?: String;
  itemOptionBorder?: String;
  stadisticBackground?: String;

  zoomLevel?: String;
}