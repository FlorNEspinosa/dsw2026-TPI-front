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
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">
            Listado de especialidades médicas
          </caption>

          <thead className="bg-med-primary-50/70 text-[10px] uppercase tracking-wider text-med-text-sub">
            <tr>
              <th scope="col" className="w-1/3 px-4 py-3">
                Nombre de la especialidad
              </th>
              <th scope="col" className="px-4 py-3">
                Descripción
              </th>

              <th scope="col" className="w-24 px-4 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border-subtle">
            {specialties.map((specialty) => (
              <tr key={specialty.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-4 font-semibold text-med-primary-900">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-med-primary-100 text-med-primary-700"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20 4 12a5 5 0 0 1 7-7l1 1 1-1a5 5 0 0 1 7 7Z"
                        />
                      </svg>
                    </span>

                    <span className="min-w-0 break-words">
                      {specialty.name}
                    </span>
                  </div>
                </td>

                <td className="break-words px-4 py-4 text-med-text-sub">
                  {specialty.description}
                </td>

                <td className="px-4 py-4 text-right">
                  <Button
                    variant="ghost"
                    disabled={!onDelete || deletingId !== null}
                    onClick={() => onDelete?.(specialty)}
                    aria-label={`Eliminar especialidad ${specialty.name}`}
                    aria-busy={deletingId === specialty.id}
                    title="Eliminar especialidad"
                    className="inline-flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6"
                      />
                    </svg>
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
