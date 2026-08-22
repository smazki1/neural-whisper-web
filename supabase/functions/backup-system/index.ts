import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const backupType = new URL(req.url).searchParams.get('type') || 'full';
    const timestamp = new Date().toISOString();

    const backupData: Record<string, unknown> = {};

    // Full backup or specific table backup
    switch (backupType) {
      case 'posts': {
        const { data: posts } = await supabaseClient
          .from('posts')
          .select('*');
        backupData.posts = posts;
        break;
      }

      case 'courses': {
        const { data: courses } = await supabaseClient
          .from('courses')
          .select('*');
        const { data: lessons } = await supabaseClient
          .from('lessons')
          .select('*');
        backupData.courses = courses;
        backupData.lessons = lessons;
        break;
      }

      case 'users': {
        const { data: profiles } = await supabaseClient
          .from('profiles')
          .select('*');
        const { data: userCourses } = await supabaseClient
          .from('user_courses')
          .select('*');
        backupData.profiles = profiles;
        backupData.user_courses = userCourses;
        break;
      }

      case 'products': {
        const { data: products } = await supabaseClient
          .from('products')
          .select('*');
        const { data: orders } = await supabaseClient
          .from('orders')
          .select('*');
        const { data: productCourses } = await supabaseClient
          .from('product_courses')
          .select('*');
        backupData.products = products;
        backupData.orders = orders;
        backupData.product_courses = productCourses;
        break;
      }

      default: { // full backup
        const tables = ['posts', 'courses', 'lessons', 'profiles', 'user_courses', 
                      'products', 'orders', 'product_courses', 'user_progress'];
        
        for (const table of tables) {
          try {
            const { data } = await supabaseClient
              .from(table)
              .select('*');
            backupData[table] = data;
          } catch (error) {
            console.error(`Error backing up table ${table}:`, error);
            backupData[table] = null;
          }
        }
      }
    }

    // Save backup to storage bucket
    const backupFileName = `backup-${backupType}-${timestamp.replace(/[:.]/g, '-')}.json`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from('backups')
      .upload(backupFileName, JSON.stringify({
        timestamp,
        type: backupType,
        data: backupData
      }, null, 2), {
        contentType: 'application/json'
      });

    if (uploadError) {
      throw uploadError;
    }

    // Log backup completion
    console.log(`Backup completed: ${backupFileName}`);
    
    // Optional: Clean up old backups (keep last 10)
    const { data: existingBackups } = await supabaseClient.storage
      .from('backups')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (existingBackups && existingBackups.length > 10) {
      const toDelete = existingBackups.slice(10);
      for (const file of toDelete) {
        await supabaseClient.storage
          .from('backups')
          .remove([file.name]);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Backup completed successfully: ${backupFileName}`,
        fileName: backupFileName,
        timestamp,
        type: backupType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: unknown) {
    console.error('Backup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
