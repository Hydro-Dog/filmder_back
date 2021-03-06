import { IsNotEmpty } from 'class-validator'

export class GameModeDTO {
  @IsNotEmpty()
  id: any

  @IsNotEmpty()
  value: string
}
