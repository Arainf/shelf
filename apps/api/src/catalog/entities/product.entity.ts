import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation, UpdateDateColumn} from "typeorm";
import {Variant} from "./variant.entity.js";


@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany('Variant', (variant: Variant) => variant.product, { cascade: true })
    variants: Relation<Variant>[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}