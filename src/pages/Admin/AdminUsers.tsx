import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users,
  Calendar,
  Mail,
  Shield,
  ShoppingCart,
  BookOpen,
  Settings,
  UserPlus,
  Crown
} from 'lucide-react';

interface User {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'instructor' | 'student';
  created_at: string;
}

interface UserStats {
  ordersCount: number;
  coursesCount: number;
  totalSpent: number;
}

interface AdminUsersProps {
  onStatsUpdate?: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userStats, setUserStats] = useState<Record<string, UserStats>>({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'instructor' | 'student' | ''>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchUserRoles();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchUserStats();
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת המשתמשים",
        variant: "destructive"
      });
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const stats: Record<string, UserStats> = {};

      for (const user of users) {
        // Get orders count and total spent
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount, status')
          .eq('user_id', user.id);

        const ordersCount = orders?.length || 0;
        const totalSpent = orders
          ?.filter(order => order.status === 'completed')
          ?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        // Get courses count (courses created by user)
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        stats[user.id] = {
          ordersCount,
          coursesCount: coursesCount || 0,
          totalSpent
        };
      }

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(role => role.user_id === userId).map(role => role.role);
  };

  const addUserRole = async (userId: string, role: 'admin' | 'instructor' | 'student') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role }]);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "התפקיד נוסף בהצלחה"
      });

      fetchUserRoles();
      setDialogOpen(false);
      setSelectedRole('');
    } catch (error) {
      console.error('Error adding user role:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בהוספת התפקיד",
        variant: "destructive"
      });
    }
  };

  const removeUserRole = async (userId: string, role: 'admin' | 'instructor' | 'student') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "הצלחה!",
        description: "התפקיד הוסר בהצלחה"
      });

      fetchUserRoles();
    } catch (error) {
      console.error('Error removing user role:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בהסרת התפקיד",
        variant: "destructive"
      });
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'admin': 'מנהל',
      'instructor': 'מדריך',
      'student': 'תלמיד'
    };
    return labels[role] || role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'instructor':
        return <Shield className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול משתמשים</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {users.length} משתמשים
        </Badge>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">אין משתמשים עדיין</h3>
            <p className="text-muted-foreground">
              המשתמשים יופיעו כאן לאחר ההרשמה
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const roles = getUserRoles(user.id);
            const stats = userStats[user.id] || { ordersCount: 0, coursesCount: 0, totalSpent: 0 };

            return (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.display_name || 'משתמש'} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-4 w-4" />
                            </div>
                          )}
                          <h3 className="text-lg font-semibold">
                            {user.display_name || 'משתמש ללא שם'}
                          </h3>
                        </div>
                        
                        <div className="flex gap-1">
                          {roles.map((role) => (
                            <Badge key={role} variant="secondary" className="flex items-center gap-1">
                              {getRoleIcon(role)}
                              {getRoleLabel(role)}
                            </Badge>
                          ))}
                          {roles.length === 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              משתמש רגיל
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>הצטרף ב{formatDate(user.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          <span>{stats.ordersCount} הזמנות</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{stats.coursesCount} קורסים</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{formatCurrency(stats.totalSpent)}</span>
                          <span>הוצא</span>
                        </div>
                      </div>
                      
                      {user.bio && (
                        <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog 
                        open={dialogOpen && selectedUser?.id === user.id} 
                        onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) setSelectedUser(user);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ניהול תפקידים - {user.display_name || 'משתמש'}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">תפקידים נוכחיים:</Label>
                              <div className="flex flex-wrap gap-2">
                                {roles.length > 0 ? (
                                  roles.map((role) => (
                                    <Badge key={role} variant="secondary" className="flex items-center gap-1">
                                      {getRoleIcon(role)}
                                      {getRoleLabel(role)}
                                      <button
                                        onClick={() => removeUserRole(user.id, role)}
                                        className="ml-1 text-xs hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">אין תפקידים מיוחדים</span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="role" className="text-sm font-medium mb-2 block">
                                הוסף תפקיד:
                              </Label>
                              <div className="flex gap-2">
                                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="בחר תפקיד" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">מנהל</SelectItem>
                                    <SelectItem value="instructor">מדריך</SelectItem>
                                    <SelectItem value="student">תלמיד</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button 
                                  onClick={() => selectedRole && addUserRole(user.id, selectedRole as any)}
                                  disabled={!selectedRole || roles.includes(selectedRole as any)}
                                >
                                  הוסף
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;