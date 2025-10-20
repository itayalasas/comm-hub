import { supabase } from '../lib/supabase';

export const applicationService = {
  async getApplicationByApplicationId(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  },

  async verifyApiKey(appId: string, apiKey: string) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('application_id', appId)
        .eq('key', apiKey)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error verifying API key:', error);
      return false;
    }
  },

  async getBranding(internalAppId: string) {
    try {
      const { data, error } = await supabase
        .from('branding_configs')
        .select('*')
        .eq('application_id', internalAppId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching branding:', error);
      return null;
    }
  },

  async getBrandingByApplicationId(internalAppId: string) {
    try {
      const { data, error } = await supabase
        .from('branding_configs')
        .select('*')
        .eq('application_id', internalAppId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching branding:', error);
      return null;
    }
  }
};
