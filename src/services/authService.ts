import { supabase } from '@/supabaseClient';
import { User } from '@/types';

export const authService = {
  /**
   * Sign up a new user with partner email
   */
  async signUp(
    name: string,
    email: string,
    password: string,
    partnerEmail: string
  ): Promise<{ user: User | null; error: Error | null; needsEmailConfirmation?: boolean }> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Check if email confirmation is required
      // If user is not confirmed and session is null, they need to confirm email
      if (!authData.session && authData.user.email_confirmed_at === null) {
        return { 
          user: null, 
          error: null, 
          needsEmailConfirmation: true 
        };
      }

      // The trigger will create the user profile automatically
      // Wait a bit for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if partner exists
      const { data: partnerData, error: partnerError } = await supabase
        .from('users')
        .select('*')
        .eq('email', partnerEmail)
        .maybeSingle();

      // Link partners if partner exists (ignore error if partner doesn't exist yet)
      if (partnerData && !partnerError) {
        await supabase.rpc('link_partners', {
          user1_id: authData.user.id,
          user2_id: partnerData.id,
        });
      }

      // Fetch the created user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) throw userError;

      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  /**
   * Log in an existing user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Login failed');

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) throw userError;

      // If user profile doesn't exist, create it now
      if (!userData) {
        console.log('User profile missing, creating now...');
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: authData.user.user_metadata?.name || 'User',
            email: authData.user.email!,
          })
          .select()
          .maybeSingle();

        if (createError) throw createError;
        return { user: newUser, error: null };
      }

      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authUser) return { user: null, error: null };

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (userError) throw userError;

      return { user: userData, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  /**
   * Get the user's partner
   */
  async getPartner(
    partnerId: string
  ): Promise<{ partner: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', partnerId)
        .maybeSingle();

      if (error) throw error;

      return { partner: data, error: null };
    } catch (error) {
      return { partner: null, error: error as Error };
    }
  },

  /**
   * Update partner link (for when partner signs up later)
   */
  async linkWithPartner(
    partnerEmail: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const { data: partnerData, error: partnerError } = await supabase
        .from('users')
        .select('*')
        .eq('email', partnerEmail)
        .maybeSingle();

      if (partnerError) throw partnerError;

      await supabase.rpc('link_partners', {
        user1_id: currentUser.user.id,
        user2_id: partnerData.id,
      });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },
};

