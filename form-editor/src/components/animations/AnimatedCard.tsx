'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ 
  children, 
  title, 
  className = '', 
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: 'easeOut' 
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`transition-shadow duration-300 hover:shadow-lg ${className}`}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
