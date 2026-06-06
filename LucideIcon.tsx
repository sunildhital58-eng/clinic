import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 20 }: LucideIconProps) {
  // Gracefully fallback or match the correct icon
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default icon like Stethoscope or Activity if not found
    const Fallback = Icons.Stethoscope;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
