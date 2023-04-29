import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('Users_pkey', ['userId'], { unique: true })
@Index('Users_UserName_key', ['userName'], { unique: true })
@Index('Users_UserName_index', ['userName'], {})
@Entity('Users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'UserId' })
  userId: number;

  @Column('character varying', { name: 'Salt' })
  salt: string;

  @Column('character varying', { name: 'Hash' })
  hash: string;

  @Column('character varying', { name: 'Country' })
  country: string;

  @Column('character varying', { name: 'UserName', unique: true })
  userName: string;

  @Column('character varying', { name: 'Name', nullable: true })
  name: string | null;
}
