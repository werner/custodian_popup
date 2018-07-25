export interface Gene {
  $update?: () => any;
  $init?: () => any;
  $cell?: boolean;
}

export type Virus = (gene: Gene) => Gene;
