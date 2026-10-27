import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { WelcomeEmailSettingsPage } from 'src/pages/Admin/Settings/WelcomeEmailSettingsPage';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';

export const handle = { breadcrumb: 'Welcome email', breadcrumbParent: 'Users' };

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = createSupabaseServerClient(request);

  const settingsService = new TenantSettingsService(client);
  const [settings, welcomeEmail] = await Promise.all([
    settingsService.get(),
    settingsService.getWelcomeEmail(),
  ]);

  return {
    welcomeEmailFromName: welcomeEmail.fromName,
    welcomeEmailSubject: welcomeEmail.subject,
    welcomeEmailContent: welcomeEmail.content,
    defaultFromName: settings.messageSignOff,
  };
}

export default function Index() {
  const settings = useLoaderData<typeof loader>();

  return <WelcomeEmailSettingsPage {...settings} />;
}
