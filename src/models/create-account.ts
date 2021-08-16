import { Matches } from 'class-validator';
import { Person } from './person';

export class CreateAccount extends Person {
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'password too weak' })
	password: string;
}
