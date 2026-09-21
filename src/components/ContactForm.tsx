import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormProps {
  description: string;
  source: string;
  serviceInterest?: string;
}

export default function ContactForm({ description, source, serviceInterest }: ContactFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "שגיאה",
        description: "אנא מלאו את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to leads table
      const { error } = await supabase
        .from('leads')
        .insert({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          source,
          service_interest: serviceInterest,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: "הטופס נשלח בהצלחה!",
        description: "נחזור אליכם בהקדם האפשרי",
      });

      // Reset form
      setFormData({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "שגיאה בשליחת הטופס",
        description: error.message || "אנא נסו שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 md:py-24 professional-section-alt">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold professional-text-primary text-center mb-4">
            נשמח לשמוע מכם
          </h2>
          <p className="text-lg professional-text-body text-center mb-12">
            {description}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="professional-card">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="professional-text-primary">
                      שם מלא <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="professional-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="professional-text-primary">
                      שם החברה/ארגון (רשות)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="professional-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="professional-text-primary">
                      אימייל <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="professional-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="professional-text-primary">
                      טלפון <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="professional-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="professional-text-primary">
                      הודעה
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="professional-input resize-none"
                    />
                  </div>



                  <Button
                    type="submit"
                    className="w-full premium-button-primary text-lg py-6"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'שולח...' : 'שלחו'}</span>
                    <Send className="mr-3 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
