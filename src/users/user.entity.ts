import { Exclude } from 'class-transformer';
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column()
    password:string;

    @AfterInsert()
    logInsert(){
        console.log(`inserito user con id: ${this.id}`)
    }

    @AfterRemove()
    logRemove(){
        console.log(`rimosso user con id: ${this.id}`)
    }

    @AfterUpdate()
    logUpdate(){
        console.log(`modificato user con id: ${this.id}`)
    }
}