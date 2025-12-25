
export type Car = {
  id: string;
  name: string;
  description: string;
  roi: number;
  totalValue: number;
  investedAmount: number;
  image: string;
  status: 'available' | 'fully-invested';
};

export type User = {
    id: string;
    name: string;
    email: string;
    balance: number;
    totalEarned: number;
    totalInvested?: number;
    referralCode: string;
    referralEarnings: number;
    createdAt: any;
    updatedAt: any;
}
