export enum DogType {
    Shiba = 'Shiba',
    Chihuahua = 'Chihuahua',
    Pitbull = 'Pitbull'
}

export class Dog{
    id!: number
    name!: string
    type!: string
}