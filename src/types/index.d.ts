export interface Gene {
  $update: () => any
}

export type Virus = (gene: Gene) => Gene;
