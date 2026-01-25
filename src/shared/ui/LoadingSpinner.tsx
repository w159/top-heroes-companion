import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-12 w-full h-full">
    <Loader2 className="animate-spin text-blue-500" size={40} />
  </div>
);

export default LoadingSpinner;
