import Button from '../../shared/components/Button';

function DoctorsTable({ doctors = [], onDelete, deletingId = null }) {
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
                Nombre del médico
              </th>
              <th scope="col" className="px-6 py-3.5">
                Especialidad
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
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50/70">
                <td className="px-6 py-4">
                  <p className="font-semibold text-med-primary-900">
                    {doctor.name}
                  </p>
                  <p className="mt-1 text-xs text-med-text-sub">
                    Matrícula: {doctor.licenseNumber || 'Sin informar'}
                  </p>
                </td>

                <td className="px-6 py-4 text-med-text-sub">
                  {doctor.specialty?.name || 'Sin especialidad'}
                </td>

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

                <td className="px-6 py-4 text-right">
                  <Button
                    variant="danger"
                    disabled={!onDelete || deletingId !== null}
                    onClick={() => onDelete?.(doctor)}
                    aria-label={`Eliminar médico ${doctor.name}`}
                    className="text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === doctor.id ? 'Eliminando...' : 'Eliminar'}
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

export default DoctorsTable;
