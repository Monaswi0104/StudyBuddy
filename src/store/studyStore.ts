import { create } from 'zustand';
import { supabase } from '../api/supabaseClient';

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'Flashcards' | 'Quiz' | 'Summary' | 'Mind Map';
  difficulty: string;
  data: any;
  createdAt: number; // timestamp
}

interface StudyStore {
  materials: StudyMaterial[];
  isLoading: boolean;
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: StudyMaterial) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  clearAll: () => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  materials: [],
  isLoading: false,

  fetchMaterials: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ materials: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const parsedMaterials: StudyMaterial[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type as any,
          difficulty: item.difficulty,
          data: item.data,
          createdAt: new Date(item.created_at).getTime(),
        }));
        set({ materials: parsedMaterials });
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMaterial: async (material) => {
    // Optimistic update
    set((state) => ({
      materials: [material, ...state.materials],
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('study_materials').insert({
        id: material.id,
        user_id: user.id,
        title: material.title,
        type: material.type,
        difficulty: material.difficulty,
        data: material.data,
        created_at: new Date(material.createdAt).toISOString(),
      });

      if (error) {
        console.error('Error saving to Supabase:', error);
        // Revert optimistic update on failure
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== material.id),
        }));
      }
    } catch (error) {
      console.error('Error in addMaterial:', error);
    }
  },

  deleteMaterial: async (id) => {
    // Store previous state for potential rollback
    const prevMaterials = get().materials;
    
    // Optimistic update
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
    }));

    try {
      const { error } = await supabase.from('study_materials').delete().eq('id', id);
      if (error) {
        console.error('Error deleting from Supabase:', error);
        // Rollback
        set({ materials: prevMaterials });
      }
    } catch (error) {
      console.error('Error in deleteMaterial:', error);
    }
  },

  clearAll: () => set({ materials: [] }),
}));
