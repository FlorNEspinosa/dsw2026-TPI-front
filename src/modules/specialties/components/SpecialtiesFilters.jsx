import NameFilter from '../../shared/components/NameFilter';

function SpecialtiesFilters({ onSearch, isLoading = false }) {
  return (
    <NameFilter
      onSearch={onSearch}
      isLoading={isLoading}
      placeholder="Buscar especialidad..."
      inputId="specialty-name-filter"
      compact
    />
  );
}

export default SpecialtiesFilters;
