import React from 'react';
import { ScrollView } from 'react-native';
import FilterButton from '../../atoms/FilterButton';

export interface Filter {
  id: string;
  label: string;
  icon: string;
}

interface FilterListProps {
  filters: Filter[];
  selectedFilter: string;
  onFilterSelect: (filterId: string) => void;
}

const FilterList: React.FC<FilterListProps> = ({
  filters,
  selectedFilter,
  onFilterSelect
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="flex-row"
    >
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          id={filter.id}
          label={filter.label}
          icon={filter.icon}
          isSelected={selectedFilter === filter.id}
          onPress={onFilterSelect}
        />
      ))}
    </ScrollView>
  );
};

export default FilterList;