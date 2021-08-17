import { IsString } from 'class-validator';

export class Login {
	@IsString()
	user: string;
	@IsString()
	password: string;
}
