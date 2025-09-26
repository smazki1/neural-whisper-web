import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => string | null;
}

interface TouchOptimizedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitLabel?: string;
  className?: string;
  isLoading?: boolean;
}

export const TouchOptimizedForm: React.FC<TouchOptimizedFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'שלח',
  className = '',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    const field = fields.find(f => f.id === fieldId);
    if (field?.validation) {
      const error = field.validation(formData[fieldId] || '');
      if (error) {
        setErrors(prev => ({ ...prev, [fieldId]: error }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.id];
      
      // Required field validation
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.id] = `${field.label} נדרש`;
        return;
      }
      
      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const allTouched = fields.reduce((acc, field) => {
        acc[field.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(allTouched);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = errors[field.id] && touched[field.id];
    const baseInputClasses = `
      w-full px-4 py-3 text-base rounded-lg border-2 transition-all duration-200
      touch-manipulation focus:ring-2 focus:ring-primary/20 focus:border-primary
      ${hasError 
        ? 'border-destructive focus:border-destructive focus:ring-destructive/20' 
        : 'border-input focus:border-primary'
      }
      bg-background placeholder:text-muted-foreground
      min-h-[44px]
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            className={`${baseInputClasses} min-h-[120px] resize-none`}
            rows={4}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 space-x-reverse">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleChange(field.id, checked)}
              className="mt-1 min-w-[20px] min-h-[20px]"
            />
            <Label
              htmlFor={field.id}
              className="text-sm leading-relaxed cursor-pointer"
              dangerouslySetInnerHTML={{ __html: field.placeholder || field.label }}
            />
          </div>
        );
      
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            inputMode={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
            autoComplete={
              field.type === 'email' ? 'email' : 
              field.type === 'tel' ? 'tel' :
              field.id.includes('name') ? 'name' : 'off'
            }
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map((field, index) => {
        const hasError = errors[field.id] && touched[field.id];
        
        return (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {field.type !== 'checkbox' && (
              <Label htmlFor={field.id} className="text-base font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            
            {renderField(field)}
            
            {/* Error Message */}
            {hasError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-sm text-destructive"
              >
                {errors[field.id]}
              </motion.p>
            )}
          </motion.div>
        );
      })}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: fields.length * 0.1 }}
      >
        <Button
          type="submit"
          size="mobile-lg"
          disabled={isLoading}
          className="w-full touch-manipulation"
        >
          {isLoading ? 'שולח...' : submitLabel}
        </Button>
      </motion.div>
    </form>
  );
};