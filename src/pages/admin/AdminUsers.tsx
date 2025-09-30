import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Group roles by user_id
      const rolesMap: Record<string, string[]> = {};
      (rolesData || []).forEach((roleRecord: UserRole) => {
        if (!rolesMap[roleRecord.user_id]) {
          rolesMap[roleRecord.user_id] = [];
        }
        rolesMap[roleRecord.user_id].push(roleRecord.role);
      });

      setUsers((profilesData as any) || []);
      setUserRoles(rolesMap);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המשתמשים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; variant: any }> = {
      admin: { label: 'מנהל', variant: 'default' },
      instructor: { label: 'מרצה', variant: 'secondary' },
      student: { label: 'תלמיד', variant: 'outline' }
    };
    
    const config = roleConfig[role] || { label: role, variant: 'secondary' };
    return <Badge key={role} variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>ניהול משתמשים - אזור ניהול</title>
        <meta name="description" content="ניהול משתמשים והרשאות" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול משתמשים</h1>
          <p className="text-lg text-muted-foreground mt-1">
            ניהול משתמשים, תפקידים והרשאות
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full mb-4" />
              ))}
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">אין משתמשים עדיין</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>רשימת משתמשים ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>מזהה</TableHead>
                    <TableHead>תפקידים</TableHead>
                    <TableHead>תאריך הצטרפות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {user.display_name || 'לא צוין'}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {user.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {userRoles[user.id]?.length > 0 ? (
                            userRoles[user.id].map((role) => getRoleBadge(role))
                          ) : (
                            <Badge variant="outline">אין תפקידים</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: he })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
