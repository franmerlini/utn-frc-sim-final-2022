export class Evento {
  constructor(
    public id: number,
    public nombre: string,
    public distribucion?: string,
    public formula?: string
  ) {}
}
