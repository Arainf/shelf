import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation, UpdateDateColumn} from "typeorm";
import {Variant} from "./variant.entity.js";
import {Unit} from "./unit.entity.js";

@Entity('product_units')
export class ProductUnit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    variantId: string;

    @ManyToOne('Variant', (variant: Variant) => variant.units, { onDelete: 'CASCADE' })
    variant: Relation<Variant>;

    @Column({ type: 'varchar' })
    unitId: string;

    @ManyToOne(() => Unit, { onDelete: 'RESTRICT' })
    unit: Relation<Unit>;

    @Column({ type: 'real', default: 1})
    conversionFactor: number;

    @Column({ type: 'boolean', default: false})
    isBase: boolean;

    @Column({ type: 'real'})
    price: number;

    @Column({ type: 'real' , nullable: true })
    costPrice?: number;

    @Column({ type: 'text', nullable: true })
    barcode?: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}