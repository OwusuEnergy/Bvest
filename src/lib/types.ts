
export type Car = {
  id: string;
  name: string;
  description: string;
  roi: number;
  totalValue: number;
  investedAmount: number;
  imageId: string;
  status: 'available' | 'fully-invested';
};
