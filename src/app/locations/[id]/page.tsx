// This is a new file for the dedicated location settings page.
import LocationSettingsForm from './location-settings-form';

// This is a Server Component that unwraps the params
// and passes them to the Client Component.
export default function LocationSettingsPage({ params }: { params: { id: string } }) {
  return <LocationSettingsForm id={params.id} />;
}
