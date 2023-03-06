import { Column, DeleteDateColumn, Entity } from 'typeorm'

import { CommonEntity } from 'src/common/common.entity'
import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator'

enum RoleType {
  'amdin' = 'amdin',
  'tenqube' = 'tenqube'
}

@Entity('user')
export class UserEntity extends CommonEntity {
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: false })
  password: string

  @DeleteDateColumn({ name: 'delete_at', nullable: true, default: null })
  deleteAt: Date | null

  @IsEnum(RoleType)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: RoleType, nullable: false })
  role: RoleType
}
