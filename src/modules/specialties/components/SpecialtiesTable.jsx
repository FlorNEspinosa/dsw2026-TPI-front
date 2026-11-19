import Button from '../../shared/components/Button';

function SpecialtiesTable({ specialties = [], onDelete, deletingId = null }) {
  if (specialties.length === 0) {
    return (
      <p role="status" className="p-6 text-center text-med-text-sub">
        No se encontraron especialidades.
      </p>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-med-border md:hidden">
        {specialties.map((specialty) => (
          <li key={specialty.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words font-semibold text-med-primary-900">
                {specialty.name}
              </h3>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  specialty.isActive
                    ? 'bg-med-active-bg text-med-active-text'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {specialty.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <p className="break-words text-sm text-med-text-sub">
              {specialty.description}
            </p>

            <Button
              variant="danger"
              disabled={!onDelete || deletingId !== null}
              onClick={() => onDelete?.(specialty)}
              aria-label={`Eliminar especialidad ${specialty.name}`}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === specialty.id ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </li>
        ))}
      </ul>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Listado de especialidades médicas
          </caption>

          <thead className="bg-med-primary-50/70 text-xs uppercase text-med-text-sub">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Nombre de la especialidad
              </th>
              <th scope="col" className="px-6 py-3.5">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3.5 text-center">
                Estado
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border-subtle">
            {specialties.map((specialty) => (
              <tr key={specialty.id} className="hover:bg-gray-50/70">
                <td className="px-6 py-4 font-semibold text-med-primary-900">
                  {specialty.name}
                </td>

                <td className="px-6 py-4 text-med-text-sub">
                  {specialty.description}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      specialty.isActive
                        ? 'bg-med-active-bg text-med-active-text'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {specialty.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <Button
                    variant="danger"
                    disabled={!onDelete || deletingId !== null}
                    onClick={() => onDelete?.(specialty)}
                    aria-label={`Eliminar especialidad ${specialty.name}`}
                    className="text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === specialty.id ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecialtiesTable;
