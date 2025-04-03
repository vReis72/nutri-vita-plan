
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/types";

/**
 * Busca todos os alimentos cadastrados
 */
export const getAllFoods = async (): Promise<Food[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('name');

  if (error) {
    console.error("Erro ao buscar alimentos:", error);
    throw new Error(`Erro ao buscar alimentos: ${error.message}`);
  }

  return data.map(food => ({
    id: food.id,
    name: food.name,
    portion: food.portion,
    calories: food.calories,
    carbs: food.carbs,
    proteins: food.proteins,
    fats: food.fats,
    fiber: food.fiber,
    category: food.category
  }));
};

/**
 * Busca um alimento pelo ID
 */
export const getFoodById = async (id: string): Promise<Food> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar alimento com id ${id}:`, error);
    throw new Error(`Erro ao buscar alimento: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    portion: data.portion,
    calories: data.calories,
    carbs: data.carbs,
    proteins: data.proteins,
    fats: data.fats,
    fiber: data.fiber,
    category: data.category
  };
};

/**
 * Cria um novo alimento
 */
export const createFood = async (food: Omit<Food, 'id'>): Promise<Food> => {
  const { data, error } = await supabase
    .from('foods')
    .insert([food])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar alimento:", error);
    throw new Error(`Erro ao criar alimento: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    portion: data.portion,
    calories: data.calories,
    carbs: data.carbs,
    proteins: data.proteins,
    fats: data.fats,
    fiber: data.fiber,
    category: data.category
  };
};

/**
 * Atualiza um alimento existente
 */
export const updateFood = async (id: string, food: Partial<Omit<Food, 'id'>>): Promise<Food> => {
  const { data, error } = await supabase
    .from('foods')
    .update(food)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar alimento com id ${id}:`, error);
    throw new Error(`Erro ao atualizar alimento: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    portion: data.portion,
    calories: data.calories,
    carbs: data.carbs,
    proteins: data.proteins,
    fats: data.fats,
    fiber: data.fiber,
    category: data.category
  };
};

/**
 * Remove um alimento
 */
export const deleteFood = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir alimento com id ${id}:`, error);
    throw new Error(`Erro ao excluir alimento: ${error.message}`);
  }
};

/**
 * Busca alimentos por categoria
 */
export const getFoodsByCategory = async (category: string): Promise<Food[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) {
    console.error(`Erro ao buscar alimentos da categoria ${category}:`, error);
    throw new Error(`Erro ao buscar alimentos por categoria: ${error.message}`);
  }

  return data.map(food => ({
    id: food.id,
    name: food.name,
    portion: food.portion,
    calories: food.calories,
    carbs: food.carbs,
    proteins: food.proteins,
    fats: food.fats,
    fiber: food.fiber,
    category: food.category
  }));
};

/**
 * Obtém todas as categorias de alimentos disponíveis
 */
export const getAllFoodCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('category')
    .order('category');

  if (error) {
    console.error("Erro ao buscar categorias de alimentos:", error);
    throw new Error(`Erro ao buscar categorias: ${error.message}`);
  }

  // Remover duplicatas
  const categories = data.map(item => item.category);
  return [...new Set(categories)];
};

/**
 * Busca alimentos por nome (pesquisa)
 */
export const searchFoodsByName = async (searchTerm: string): Promise<Food[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('name');

  if (error) {
    console.error(`Erro ao pesquisar alimentos contendo "${searchTerm}":`, error);
    throw new Error(`Erro ao pesquisar alimentos: ${error.message}`);
  }

  return data.map(food => ({
    id: food.id,
    name: food.name,
    portion: food.portion,
    calories: food.calories,
    carbs: food.carbs,
    proteins: food.proteins,
    fats: food.fats,
    fiber: food.fiber,
    category: food.category
  }));
};
