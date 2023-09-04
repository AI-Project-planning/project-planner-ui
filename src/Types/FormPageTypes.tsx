export interface Indexable {
  [key: string]: any;
}

export type Directions = Indexable & {
  1: string, 
  2: string, 
  3: string
}

export type QuestionComponents = Indexable & {
  1: JSX.Element,
  2: JSX.Element,
  3: JSX.Element,
  4: JSX.Element
}

export type TechStacks = Indexable & {
  frontend: string[],
  backend: string[],
  fullstack: string[]
}

export type ErrorConditions = Indexable & {
  1: [boolean, string];
  2: [boolean, string];
  3: [boolean, string];
  4: [boolean, string];
}

export interface TimeFrame {
  amount: number,
  type: string
}

export interface ErrorMsg {
  error: boolean,
  message: string
}

export interface FormData {
  type: string,
  technologies: string,
  time: string,
  collaborators: number
}
