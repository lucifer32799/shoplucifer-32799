
import React from 'react';
import { useEdit } from '@/contexts/EditContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';

const ProductFilter = () => {
  const { selectedCategory, setSelectedCategory, getCategories } = useEdit();
  const categories = getCategories();

  return (
    <div className="mb-8 flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Lọc theo danh mục: {selectedCategory}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-blue-100' : ''}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductFilter;
