import { ObjectId } from 'mongodb';

export interface Branch {
  _id?: ObjectId;
  name: string;
  address: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}
