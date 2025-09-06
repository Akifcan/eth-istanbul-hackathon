import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    transaction: string

    @Column()
    createdWallet: string

    @CreateDateColumn()
    createdAt: Date
}