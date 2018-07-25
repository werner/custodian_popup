export interface Cell {
  id?: string;
  $update?: () => void;
  $init?: () => any;
  $cell?: boolean;
  $virus?: (component: Cell) => Cell;
  $tag?: string;
  $type?: string;
  $text?: string;
  class?: string;
  $$?: Array<Cell>;
  $components?: Array<Cell>;
}

export type Virus = (gene: Cell) => Cell;
