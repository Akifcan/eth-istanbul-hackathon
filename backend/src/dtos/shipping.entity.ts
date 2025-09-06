import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shipping {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    address: string

    @Column({name: 'phone_number'})
    phoneNumber: string

    @Column({name: 'campaign_transaction_id'})
    campaignTransactionId: string

    @Column({name: 'wallet_address'})
    walletAddress: string

    @CreateDateColumn()
    createdAd: Date

}