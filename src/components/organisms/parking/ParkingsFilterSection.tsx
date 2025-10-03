import React from 'react';
import { View } from 'react-native';
import FilterList, { Filter } from '../../molecules/parking/FilterList';

interface ParkingsFilterSectionProps {
  filters: Filter[];
  selectedFilter: string;
  onFilterSelect: (filterId: string) => void;
}

const ParkingsFilterSection: React.FC<ParkingsFilterSectionProps> = ({
  filters,
  selectedFilter,
  onFilterSelect
}) => {
  return (
    <View className="px-4 mb-4">
      <FilterList
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterSelect={onFilterSelect}
      />
    </View>
  );
};

export default ParkingsFilterSection;