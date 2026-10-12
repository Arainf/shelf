import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Role} from "@shelf/shared";


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    username: string;

    @Column({ type: 'text', name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'full_name' })
    fullName: string;

    @Column({ type: 'varchar', length: 25, })
    role: Role;

    @Column({ type: 'boolean' ,name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'integer' ,name: 'token_version', default: 0 })
    tokenVersion: number;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt: Date;
}