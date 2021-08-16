import { IsIn, IsString } from 'class-validator';

export class Person {
	@IsString()
	name: string;
	@IsString()
	lastName: string;
	@IsString()
	user: string;
	@IsString()
	@IsIn(['USD', 'EUR', 'ARS'])
	coin: string;
}
