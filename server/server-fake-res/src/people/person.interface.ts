import faker from 'faker'

export type Person = {
    firstName: string,
    lastName: string,
    age: number,
    address: string
}

export const generatePeople = (num: number) => {
    return Array.from({length: num}, (): Person => {
        return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            age: faker.random.number({ min: 18, max: 70 }),
            address: faker.address.country()
        }
    })
}