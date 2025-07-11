// This is a new file to handle creating a new location.
// It redirects to the dynamic settings page with a special "new" ID.
import LocationSettingsPage from "../[id]/page";

export default function NewLocationPage() {
    return <LocationSettingsPage params={{ id: "new" }} />;
}
