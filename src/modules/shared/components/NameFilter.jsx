import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

function NameFilter({
  onSearch,
  isLoading = false,
  placeholder = 'Ingresá un nombre',
  inputId = 'name-filter',
  onNameChange,
  compact = false,
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
    onNameChange?.('');
    onSearch('');
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className={
        compact
          ? 'w-full sm:w-72'
          : 'flex flex-col sm:flex-row sm:items-start gap-3'
      }
    >
      <div className="relative flex-1 flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={
            compact ? 'sr-only' : 'text-xs font-semibold text-med-text-main'
          }
        >
          Buscar por nombre
        </label>

        {compact && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-2 h-4 w-4 text-med-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="m15 15 5 5" />
          </svg>
        )}
        <Input
          id={inputId}
          type={compact ? 'search' : 'text'}
          className={compact ? 'pl-9 py-1.5 text-xs bg-med-primary-50' : ''}
          placeholder={placeholder}
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
          error={errors.name?.message}
          {...register('name', {
            onChange: (event) => {
              onNameChange?.(event.target.value);
            },
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

      {!compact && (
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
      )}
    </form>
  );
}

export default NameFilter;
