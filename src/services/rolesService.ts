import { supabase } from '../lib/supabase';

export const rolesService = {
  async getRolesByApplication(internalAppId: string) {
    try {
      const { data, error } = await supabase
        .from('application_roles')
        .select('*')
        .eq('application_id', internalAppId)
        .order('display_name');

      if (error) {
        console.error('Error fetching roles from DB:', error);
        throw error;
      }

      console.log('✅ Roles loaded:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      return [];
    }
  },

  async getAvailableRolesForRegistration(internalAppId: string) {
    try {
      // Try with both columns first
      let { data, error } = await supabase
        .from('application_roles')
        .select('*')
        .eq('application_id', internalAppId)
        .order('display_name');

      // If columns exist, filter in JS (safer than SQL)
      if (data) {
        // Filter by available_for_registration if it exists
        const filtered = data.filter(role => {
          // If column doesn't exist, show all roles
          if (role.hasOwnProperty('available_for_registration')) {
            return role.available_for_registration === true;
          }
          // If column doesn't exist, show all non-admin roles or default roles
          return role.is_default === true || role.name !== 'admin';
        });

        console.log('✅ Roles for registration loaded:', filtered);
        return filtered || [];
      }

      if (error) {
        console.error('Error fetching roles for registration:', error);
        return [];
      }

      return [];
    } catch (error) {
      console.error('❌ Error fetching roles for registration:', error);
      return [];
    }
  }
};
