import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Wrench, ArrowLeft, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const iconMap = {
  'מאמר': BookOpen,
  'מדריך': FileText,
  'כלי': Wrench,
  'הורדה': Download,
};

const tagColors = {
  'חדש': 'bg-blue-500/20 text-blue-300',
  'פופולרי': 'bg-emerald-500/20 text-emerald-300',
  'בלעדי': 'bg-purple-500/20 text-purple-300',
};

interface Resource {
  id: string;
  name: string;
  content_type: string;
  short_description: string | null;
  duration: string | null;
  action_link: string | null;
  search_tags: string | null;
}

const FreeResourcesSection = () => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase
        .from('content_services')
        .select('id, name, content_type, short_description, duration, action_link, search_tags')
        .eq('status', 'פעיל')
        .order('display_order', { ascending: true })
        .limit(3);

      if (data) {
        setResources(data);
      }
    };

    fetchResources();
  }, []);

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden professional-section-bg" dir="rtl">
      <div className="section-divider"></div>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="block professional-text-primary">מרחבי השראה ולימוד</span>
          </motion.h2>
        </motion.div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl professional-text-muted">בקרוב...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {resources.map((resource, index) => {
            const IconComponent = iconMap[resource.content_type as keyof typeof iconMap] || FileText;
            const tags = resource.search_tags?.split(',').map(t => t.trim()) || [];
            const mainTag = tags[0] || 'חדש';
            const tagColor = tagColors[mainTag as keyof typeof tagColors] || tagColors['חדש'];
            
            return (
              <motion.div
                key={resource.id}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <a 
                  href={resource.action_link || '#'}
                  className="block professional-card p-8 lg:p-10 h-full relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  {/* Header */}
                  <div className="relative mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <p className="professional-text-muted text-sm font-medium">{resource.content_type}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${tagColor}`}>
                          {mainTag}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative space-y-6">
                    <h3 className="text-2xl lg:text-2xl font-bold professional-text-primary leading-tight">
                      {resource.name}
                    </h3>
                    
                    <p className="professional-text-body text-base leading-relaxed">
                      {resource.short_description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-brand-text/10">
                      <span className="professional-text-muted text-sm">{resource.duration || 'זמין כעת'}</span>
                      {resource.action_link && (
                        <div className="flex items-center gap-2 professional-text-accent font-medium">
                          <span className="text-sm">לצפייה</span>
                          <ArrowLeft className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FreeResourcesSection;