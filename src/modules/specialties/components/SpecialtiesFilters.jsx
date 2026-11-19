import NameFilter from '../../shared/components/NameFilter';

function SpecialtiesFilters({ onSearch, isLoading = false }) {
  return (
    <NameFilter
      onSearch={onSearch}
      isLoading={isLoading}
      placeholder="Ej.: Cardiología"
      inputId="specialty-name-filter"
    />
  );
}

export default SpecialtiesFilters;
