import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = "", 
  width = '1200px', 
  height = 'auto',
  borderRadius,
}) => {
  return (
    <div className="flex w-full justify-center">
      <div 
        className={className} 
        style={{ 
          width: width, 
          height: height,
          maxWidth: '100%',
          borderRadius: borderRadius,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
