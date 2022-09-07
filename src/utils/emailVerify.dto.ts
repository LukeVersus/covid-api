import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerifyDto {
	@IsNotEmpty({ message: "O 'email' deve ser informada." })
	@IsEmail({ message: "O 'email' deve ser valido." })
	email: string;
}