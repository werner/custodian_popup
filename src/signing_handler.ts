import { Virus } from './types/index';

interface Signing {
  id: string;
  $virus: Virus;
}

export function signingHandler (): Signing {
  return {
    id: 'signing'
  }
}
