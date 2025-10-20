export const ipService = {
  async getClientIP() {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      console.log('Detected client IP:', ip);
      return ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return '0.0.0.0';
    }
  },

  async checkIPStatus(clientIp) {
    try {
      const ipToCheck = clientIp || await this.getClientIP();

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = `${supabaseUrl}/functions/v1/check-ip-status`;

      console.log('🔍 Checking IP status for:', ipToCheck);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({ client_ip: ipToCheck })
      });

      console.log('📡 Response status:', response.status);

      const result = await response.json();
      console.log('📦 Response data:', result);

      if (result.success) {
        return {
          is_blocked: result.data.is_blocked,
          blocked_info: result.data.blocked_info,
          ip_address: result.data.ip_address
        };
      }

      return {
        is_blocked: false,
        blocked_info: null,
        ip_address: ipToCheck
      };
    } catch (error) {
      console.error('❌ Error checking IP status:', error);
      return {
        is_blocked: false,
        blocked_info: null,
        ip_address: '0.0.0.0'
      };
    }
  }
};
