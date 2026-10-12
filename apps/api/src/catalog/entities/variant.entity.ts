import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, type Relation,
    UpdateDateColumn
} from "typeorm";
import {Product} from "./product.entity.js";
import {ProductUnit} from "./product-unit.entity.js";


@Entity('variants')
export class Variant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar'})
    productId: string;

    @ManyToOne('Product', (product: Product) => product.variants, { onDelete: 'CASCADE' })
    product: Relation<Product>;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', unique: true, nullable: true })
    sku?: string;

    @OneToMany('ProductUnit', (unit: ProductUnit) => unit.variant, { cascade: true })
    units: Relation<ProductUnit>[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}
