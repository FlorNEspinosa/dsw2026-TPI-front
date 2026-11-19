import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Alert from '../../shared/components/Alert';
import SpecialtyForm from '../components/SpecialtyForm';
import useCreateSpecialty from '../hooks/useCreateSpecialty';

function CreateSpecialtyPage() {
  const navigate = useNavigate();

  const { saveSpecialty, isSaving, errorMessage } = useCreateSpecialty();

  const handleSave = async (specialty) => {
    const createdSpecialty = await saveSpecialty(specialty);

    if (createdSpecialty) {
      navigate('/admin/specialties', {
        replace: true,
        state: {
          notification: {
            id: crypto.randomUUID(),
            message: 'La especialidad se creó correctamente.',
          },
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/specialties');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Registrar Nueva Especialidad
        </h1>

        <p className="mt-1 text-sm text-med-text-sub">
          Completá los datos para registrar una especialidad médica.
        </p>
      </div>

      <Card>
        <Alert message={errorMessage} className="mb-5" />

        <SpecialtyForm
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </Card>
    </div>
  );
}

export default CreateSpecialtyPage;
