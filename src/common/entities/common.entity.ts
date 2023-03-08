import { Column, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class CommonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Generated('uuid')
  uuid: string

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date
}
