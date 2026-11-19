import { useNavigate } from 'react-router-dom';
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-med-text-main">
          Registrar Nuevo Médico
        </h1>

        <p className="mt-1 text-sm text-med-text-sub">
          Completá los datos y seleccioná la especialidad del médico.
        </p>
      </div>

      <Card>
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
