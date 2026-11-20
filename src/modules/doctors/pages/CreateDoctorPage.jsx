import { Link, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import DoctorForm from '../components/DoctorForm';
import useCreateDoctor from '../hooks/useCreateDoctor';
import useSpecialtyOptions from '../../specialties/hooks/useSpecialtyOptions';

function CreateDoctorPage() {
  const navigate = useNavigate();

  const { saveDoctor, isSaving, errorMessage } = useCreateDoctor();

  const {
    specialties,
    isLoading,
    errorMessage: specialtiesError,
    reload,
  } = useSpecialtyOptions();

  const handleSave = async (doctor) => {
    const createdDoctor = await saveDoctor(doctor);

    if (createdDoctor) {
      navigate('/admin/doctors', {
        replace: true,
        state: {
          notification: {
            id: crypto.randomUUID(),
            message: 'El médico se registró correctamente.',
          },
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/doctors');
  };

  return (
    <div className="flex w-full max-w-4xl flex-col gap-5">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-2 text-xs text-med-text-sub"
      >
        <Link
          to="/admin/doctors"
          className="hover:text-med-primary-900 hover:underline"
        >
          Doctores
        </Link>

        <span aria-hidden="true">›</span>

        <span
          aria-current="page"
          className="font-semibold text-med-primary-900"
        >
          Agregar Nuevo Doctor
        </span>
      </nav>

      <Card className="overflow-hidden">
        <div className="-mx-5 -mt-5 mb-6 border-b border-med-border bg-med-primary-50/30 px-5 py-5">
          <h1 className="text-lg font-semibold text-med-primary-900">
            Registrar Nuevo Doctor
          </h1>

          <p className="mt-1 text-xs text-med-text-sub">
            Complete los campos obligatorios para registrar al profesional en el
            sistema.
          </p>
        </div>

        {isLoading ? (
          <p role="status" className="py-6 text-center text-med-text-sub">
            Cargando especialidades...
          </p>
        ) : specialtiesError ? (
          <div className="flex flex-col items-start gap-3">
            <Alert message={specialtiesError} />

            <div className="flex gap-3">
              <Button onClick={reload}>Reintentar</Button>

              <Button variant="secondary" onClick={handleCancel}>
                Volver al listado
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Alert message={errorMessage} className="mb-5" />

            <DoctorForm
              specialties={specialties}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default CreateDoctorPage;
