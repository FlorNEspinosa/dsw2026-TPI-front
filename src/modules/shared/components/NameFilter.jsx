import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

function NameFilter({
  onSearch,
  isLoading = false,
  placeholder = 'Ingresá un nombre',
  inputId = 'name-filter',
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const onValid = (data) => {
    onSearch(data.name.trim());
  };

  const handleClear = () => {
    reset({ name: '' });
    onSearch('');
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col sm:flex-row sm:items-start gap-3"
    >
      <div className="flex-1 flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-med-text-main"
        >
          Buscar por nombre
        </label>

        <Input
          id={inputId}
          type="text"
          placeholder={placeholder}
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
          error={errors.name?.message}
          {...register('name', {
            validate: (value) => {
              const name = value.trim();

              return (
                name.length === 0 ||
                (name.length >= 3 && name.length <= 100) ||
                'Ingresá entre 3 y 100 caracteres para buscar.'
              );
            },
          })}
        />
      </div>

      <div className="flex gap-3 sm:pt-5">
        <Button
          type="submit"
          disabled={isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buscar
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          disabled={isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </Button>
      </div>
    </form>
  );
}

export default NameFilter;
