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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Listado de médicos</caption>

          <thead className="bg-med-primary-50/70 text-xs uppercase text-med-text-sub">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                {onView ? 'Nombre del doctor' : 'Nombre del médico'}
              </th>
              <th scope="col" className="px-6 py-3.5">
                Especialidad
              </th>
              {!onView && (
                <th scope="col" className="px-6 py-3.5 text-center">
                  Estado
                </th>
              )}
              <th scope="col" className="px-6 py-3.5 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border-subtle">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50/70">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {onView && (
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-med-primary-100 text-lg"
                      >
                        👨‍⚕️
                      </span>
                    )}

                    <div>
                      <p className="font-semibold text-med-primary-900">
                        {doctor.name}
                      </p>
                      {!onView && (
                        <p className="mt-1 text-xs text-med-text-sub">
                          Matrícula: {doctor.licenseNumber || 'Sin informar'}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-med-text-sub">
                  {doctor.specialty?.name || 'Sin especialidad'}
                </td>

                {!onView && (
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        doctor.isActive
                          ? 'bg-med-active-bg text-med-active-text'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {doctor.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                )}

                <td className="px-6 py-4 text-right">
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
                      variant="danger"
                      disabled={!onDelete || deletingId !== null}
                      onClick={() => onDelete?.(doctor)}
                      aria-label={`Eliminar médico ${doctor.name}`}
                      className="text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === doctor.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorsTable;
