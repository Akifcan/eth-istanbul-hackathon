import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Seller } from "./seller.entity";

@Entity()
export class Offers {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    contract: string

    @Column()
    wallet: string

    @ManyToOne(() => Seller, seller => seller.id, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'seller_id' })
    seller?: Seller

    @CreateDateColumn()
    createdAt: Date

}