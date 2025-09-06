import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'

@Entity()
export class Seller {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({ name: 'photo_url' })
    photoUrl: string

    @CreateDateColumn()
    createdAt: Date

    @BeforeInsert()
    async beforeInsert() {
        const saltRounds = Number(process.env.PASSWORD_SALT_ROUND)
        const hash = await bcrypt.hash(this.password, saltRounds)

        this.password = hash
    }

}