import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    transaction: string

    @Column({name: 'created_wallet'})
    createdWallet: string

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date
}