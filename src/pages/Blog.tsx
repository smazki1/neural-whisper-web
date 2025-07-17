import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  published: boolean;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      // Show only published posts, sorted by date (newest first)
      const publishedPosts = allPosts
        .filter((post: BlogPost) => post.published)
        .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(publishedPosts);
    }
  }, []);

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onContactClick={() => {}} />
        
        <div className="container mx-auto px-4 py-12 max-w-4xl" dir="rtl">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 text-primary hover:text-primary/80 transition-colors"
          >
            ← חזרה לבלוג
          </button>
          
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedPost.date).toLocaleDateString('he-IL')}</span>
                </div>
              </div>
            </header>
            
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedPost.content}
            </div>
          </article>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onContactClick={() => {}} />
      
      <div className="container mx-auto px-4 py-12" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            הבלוג שלנו
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מאמרים, טיפים ותובנות מהתחום שלנו
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                בקרוב...
              </h3>
              <p className="text-muted-foreground">
                אנחנו עובדים על תוכן מעניין עבורכם. חזרו בקרוב!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                onClick={() => setSelectedPost(post)}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString('he-IL')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Badge variant="secondary" className="text-xs">
                      קראו עוד →
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;