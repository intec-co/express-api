import { IsIn, IsString } from 'class-validator';

export class Person {
	@IsString()
	name: string;
	@IsString()
	lastName: string;
	@IsString()
	user: string;
	@IsString()
	@IsIn(['usd', 'eur', 'ars'])
	currency: 'usd' | 'eur' | 'ars';
}
