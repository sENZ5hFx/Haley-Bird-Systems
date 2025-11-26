import { create } from 'zustand';

interface NotionBlock {
  id: string;
  type: string;
  content: string;
  children?: NotionBlock[];
}

interface NotionPage {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  properties: Record<string, unknown>;
  blocks: NotionBlock[];
}

interface NotionContentState {
  pages: Record<string, NotionPage | null>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  isConnected: boolean;
  
  fetchContent: (type: 'hiring' | 'projects' | 'collaborators') => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useNotionContent = create<NotionContentState>((set, get) => ({
  pages: {},
  loading: {},
  errors: {},
  isConnected: false,
  
  fetchContent: async (type) => {
    set(state => ({
      loading: { ...state.loading, [type]: true },
      errors: { ...state.errors, [type]: null }
    }));
    
    try {
      const response = await fetch(`/api/notion/content/${type}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      
      const result = await response.json();
      
      set(state => ({
        pages: { ...state.pages, [type]: result.data },
        loading: { ...state.loading, [type]: false }
      }));
    } catch (error) {
      set(state => ({
        loading: { ...state.loading, [type]: false },
        errors: { ...state.errors, [type]: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  },
  
  checkStatus: async () => {
    try {
      const response = await fetch('/api/notion/status');
      if (!response.ok) throw new Error('Failed to check status');
      
      const result = await response.json();
      set({ isConnected: result.configured });
    } catch (error) {
      set({ isConnected: false });
    }
  }
}));
