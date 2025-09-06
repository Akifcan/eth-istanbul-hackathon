import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Offers {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    contract: string

    @Column()
    wallet: string

    @CreateDateColumn()
    createdAt: Date

}