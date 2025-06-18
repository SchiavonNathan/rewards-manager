export class CreateUserDto {
  username: string;
  password: string;
  name: string;
  email: string;
  role: "USER" | "ADM";
}