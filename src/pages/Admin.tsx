import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  published: boolean;
}

const Admin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published: false
  });
  const { toast } = useToast();

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    const newPost: BlogPost = {
      id: currentPost?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      author: formData.author || 'Admin',
      date: currentPost?.date || new Date().toISOString(),
      published: formData.published
    };

    if (currentPost) {
      // Update existing post
      setPosts(posts.map(post => post.id === currentPost.id ? newPost : post));
      toast({
        title: "הצלחה!",
        description: "הפוסט עודכן בהצלחה"
      });
    } else {
      // Create new post
      setPosts([newPost, ...posts]);
      toast({
        title: "הצלחה!",
        description: "פוסט חדש נוצר בהצלחה"
      });
    }

    // Reset form
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      published: false
    });
    setIsEditing(false);
    setCurrentPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      published: post.published
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "הצלחה!",
        description: "הפוסט נמחק בהצלחה"
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      published: false
    });
  };

  return (
    <div className="min-h-screen bg-background p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground animate-fade-in">פאנל ניהול - דאשבורד</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">
                {isEditing ? 'עריכת פוסט' : 'יצירת פוסט חדש'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">כותרת *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="הכנס כותרת לפוסט"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">כותב</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="שם הכותב"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">תקציר</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="תקציר קצר של הפוסט"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">תוכן הפוסט *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="כתוב את תוכן הפוסט כאן..."
                    rows={10}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="published">פרסם מיד</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 hover-scale">
                    {isEditing ? 'עדכן פוסט' : 'צור פוסט'}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={cancelEdit} className="hover-scale">
                      ביטול
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Posts List Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">רשימת פוסטים</h2>
                <div className="text-sm text-muted-foreground">
                  {posts.length} פוסטים בסך הכל
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>אין פוסטים עדיין. צור את הפוסט הראשון שלך!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>מאת: {post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString('he-IL')}</span>
                        <span className={`px-2 py-1 rounded ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.published ? 'פורסם' : 'טיוטה'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;