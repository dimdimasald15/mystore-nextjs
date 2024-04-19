export type Product = {
  id: string;
  name: string;
  image: string;
  stock: [
    {
      qty: number;
      size: string;
    }
  ];
  price: number;
  category: string;
  status: boolean;
  description?: string;
  updated_at: Date;
  created_at: Date;
};
