import Button from '../../shared/components/Button';

function DoctorsTable({ doctors = [], onDelete, deletingId = null, onView }) {
  if (doctors.length === 0) {
    return (
      <p role="status" className="p-6 text-center text-med-text-sub">
        No se encontraron médicos.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Listado de médicos</caption>

        <thead className="bg-med-primary-50/70 text-[10px] uppercase tracking-wider text-med-text-sub">
          <tr>
            <th scope="col" className="w-1/2 px-4 py-3">
              Nombre del doctor
            </th>
            <th scope="col" className="px-4 py-3">
              Especialidad
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-med-border-subtle">
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="hover:bg-gray-50/70">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-50 text-xl">
                    <span aria-hidden="true">👨‍⚕️</span>

                    <span className="sr-only">
                      {doctor.isActive ? 'Activo' : 'Inactivo'}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                        doctor.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-med-primary-900">
                      {doctor.name}
                    </p>

                    {!onView && (
                      <p className="mt-1 text-xs text-med-text-muted">
                        Matrícula: {doctor.licenseNumber || 'Sin informar'}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <span className="inline-flex rounded-full bg-med-primary-100 px-2.5 py-1 text-xs font-medium text-med-primary-700">
                  {doctor.specialty?.name || 'Sin especialidad'}
                </span>
              </td>

              <td className="px-4 py-4 text-right">
                {onView ? (
                  <Button
                    variant="ghost"
                    onClick={() => onView(doctor)}
                    aria-label={`Ver detalle de ${doctor.name}`}
                    className="text-xs"
                  >
                    Ver detalle
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    disabled={!onDelete || deletingId !== null}
                    onClick={() => onDelete?.(doctor)}
                    aria-label={`Eliminar médico ${doctor.name}`}
                    aria-busy={deletingId === doctor.id}
                    title="Eliminar médico"
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
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorsTable;
