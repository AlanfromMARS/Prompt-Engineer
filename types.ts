
export interface Prompt {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createTime: number;
  updatedTime: number;
}

export interface CategoryRule {
  id: string;
  category: string;
  keywords: string[];
}

export type StorageMode = 'local' | 'cloud';

export interface AppState {
  prompts: Prompt[];
  rules: CategoryRule[];
  isLocked: boolean;
  searchQuery: string;
  selectedCategory: string;
}
