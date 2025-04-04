
export interface Food {
  id: string;
  name: string;
  portion: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  fiber?: number;
  category: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: {
    foodId: string;
    food: Food;
    quantity: number;
  }[];
}
