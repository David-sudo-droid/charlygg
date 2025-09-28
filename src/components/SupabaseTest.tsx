import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [listingsCount, setListingsCount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setError('');
    
    try {
      // Test basic connection
      const { data, error, count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      setListingsCount(count || 0);
      setConnectionStatus('success');
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      setConnectionStatus('error');
    }
  };

  const addTestListing = async () => {
    try {
      const testListing = {
        title: 'Test Car - Toyota Corolla 2020',
        type: 'car',
        price: 1500000,
        currency: 'KSH',
        location: 'Nairobi',
        description: 'Test listing created by Supabase connection test',
        whatsapp_number: '+254712345678',
        images: ['https://via.placeholder.com/400x300?text=Test+Car'],
        features: ['Manual Transmission', 'Air Conditioning', 'Power Steering'],
        specifications: {
          year: 2020,
          make: 'Toyota',
          model: 'Corolla',
          mileage: '50,000 km',
          engine: '1.8L',
          fuel: 'Petrol'
        },
        featured: false
      };

      const { error } = await supabase
        .from('listings')
        .insert(testListing);

      if (error) {
        throw error;
      }

      // Refresh connection test
      testConnection();
    } catch (err: any) {
      setError(err.message || 'Failed to add test listing');
      setConnectionStatus('error');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {connectionStatus === 'testing' && <Loader2 className="w-5 h-5 animate-spin" />}
          {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {connectionStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Status:</p>
          <p className="font-semibold">
            {connectionStatus === 'testing' && 'Testing connection...'}
            {connectionStatus === 'success' && 'Connected successfully!'}
            {connectionStatus === 'error' && 'Connection failed'}
          </p>
        </div>

        {connectionStatus === 'success' && (
          <div>
            <p className="text-sm text-muted-foreground">Listings in database:</p>
            <p className="font-semibold text-primary">{listingsCount}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={testConnection} variant="outline" size="sm">
            Test Again
          </Button>
          {connectionStatus === 'success' && (
            <Button onClick={addTestListing} size="sm">
              Add Test Listing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;
