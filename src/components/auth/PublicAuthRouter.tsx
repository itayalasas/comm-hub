import React, { useEffect, useState } from 'react';
import PublicAuthForms from './PublicAuthForms';
import { applicationService } from '../../services/applicationService';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'react-router-dom';

interface PublicAuthRouterProps {
  appId: string;
  formType: string;
}

export default function PublicAuthRouter({ appId, formType }: PublicAuthRouterProps) {
  const [appData, setAppData] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const validFormType = ['login', 'register', 'reset-password'].includes(formType)
    ? formType as 'login' | 'register' | 'reset-password'
    : 'login';

  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        setLoading(true);
        console.log('Loading application data for:', appId);

        // Get API key from URL first
        const apiKeyFromUrl = searchParams.get('api_key');
        if (apiKeyFromUrl) {
          console.log('✅ API key from URL:', apiKeyFromUrl.substring(0, 20) + '...');
          setApiKey(apiKeyFromUrl);
        } else {
          console.warn('⚠️ No API key in URL');
        }

        try {
          const { data: app, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('application_id', appId)
            .single();

          if (appError || !app) {
            console.error('Application not found:', appId, appError);
            setError('Application not found');
            return;
          }

          try {
            const branding = await applicationService.getBranding(app.id);
            setAppData({
              ...app,
              branding: branding || {}
            });
          } catch (brandingError) {
            console.warn('Could not load branding, using defaults:', brandingError);
            setAppData({
              ...app,
              branding: {}
            });
          }

          console.log('Application loaded:', app);

        } catch (supabaseError) {
          console.error('Supabase connection error:', supabaseError);
          setError('Failed to connect to database');
        }

      } catch (error) {
        console.error('Error loading application:', error);
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    loadApplicationData();
  }, [appId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PublicAuthForms
      applicationId={appId}
      internalApplicationId={appData?.id}
      formType={validFormType}
      apiKey={apiKey}
      branding={appData?.branding}
      appInfo={appData}
      onSuccess={(data) => console.log('Auth success:', data)}
      onError={(error) => console.error('Auth error:', error)}
    />
  );
}
