import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded-sm h-4',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Skeleton específico para ProductCard
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square relative">
        <Skeleton className="w-full h-full" variant="rectangular" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton className="w-16 h-3" />
        
        {/* Title */}
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-16 h-4" />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4" variant="circular" />
          ))}
          <Skeleton className="w-8 h-3 ml-1" />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="flex-1 h-9" />
          <Skeleton className="w-9 h-9" />
        </div>
      </div>
    </div>
  );
};

// Skeleton para ProductGrid
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton para lista de categorías
export const CategoryListSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg">
          <Skeleton className="w-8 h-8" variant="circular" />
          <Skeleton className="flex-1 h-4" />
          <Skeleton className="w-6 h-3" />
        </div>
      ))}
    </div>
  );
};

// Skeleton para detalles de producto
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-full aspect-square" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
      
      {/* Product info skeleton */}
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-3" />
          <span className="text-gray-400">/</span>
          <Skeleton className="w-20 h-3" />
          <span className="text-gray-400">/</span>
          <Skeleton className="w-24 h-3" />
        </div>
        
        {/* Brand */}
        <Skeleton className="w-24 h-4" />
        
        {/* Title */}
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-2/3 h-6" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4" variant="circular" />
            ))}
          </div>
          <Skeleton className="w-16 h-3" />
        </div>
        
        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-24 h-4" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
        </div>
        
        {/* Specs */}
        <div className="space-y-3">
          <Skeleton className="w-32 h-5" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    </div>
  );
};

// Skeleton para carrito
export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <Skeleton className="w-16 h-16" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-8" />
      </div>
      <Skeleton className="w-16 h-4" />
    </div>
  );
};

export const CartSkeleton: React.FC = () => {
  return (
    <div className="space-y-0">
      {[...Array(3)].map((_, index) => (
        <CartItemSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton para formularios
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
      ))}
      <Skeleton className="w-full h-12" />
    </div>
  );
};

export default Skeleton;