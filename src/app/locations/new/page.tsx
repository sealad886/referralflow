// This is a new file to handle creating a new location.
// It redirects to the dynamic settings page with a special "new" ID.
import LocationSettingsForm from "../[id]/location-settings-form";

export default function NewLocationPage() {
    return <LocationSettingsForm id="new" />;
}
