import type { JSONContent } from '@tiptap/core';
import { type FormEvent, useState } from 'react';
import { useToast } from 'src/common/Toast/useToast';
import { FieldRichText } from 'src/pages/News/FormFields/FieldRichText/FieldRichText';
import { adminSettingsService } from 'src/services/adminSettingsService';
import { imagePickerService } from 'src/services/imagePickerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveSettings } from './useSaveSettings';

interface IProps {
  welcomeEmailFromName: string | null;
  welcomeEmailSubject: string | null;
  welcomeEmailContent: JSONContent | null;
  defaultFromName: string;
}

const uploadImage = (file: File) => {
  const uniqueFile = new File([file], `${crypto.randomUUID()}-${file.name}`, { type: file.type });

  return imagePickerService.upload('settings/memberships', uniqueFile).catch(() => null);
};

export function WelcomeEmailSettingsPage(props: IProps) {
  const [form, setForm] = useState({
    welcomeEmailFromName: props.welcomeEmailFromName ?? '',
    welcomeEmailSubject: props.welcomeEmailSubject ?? '',
    welcomeEmailContent: props.welcomeEmailContent,
  });
  const [sendingTest, setSendingTest] = useState(false);
  const { save, submitting } = useSaveSettings();
  const toast = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    save(form);
  };

  const sendTest = () => {
    setSendingTest(true);

    const promise = adminSettingsService
      .sendWelcomeEmailPreview({
        fromName: form.welcomeEmailFromName,
        subject: form.welcomeEmailSubject,
        content: form.welcomeEmailContent,
      })
      .finally(() => setSendingTest(false));

    toast.promise(promise, {
      loading: 'Sending test email...',
      success: 'Test email sent to your address',
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Welcome email</h1>

      <p className="text-sm text-muted-foreground">
        Sent to new members once their first membership payment goes through. Leave the body empty
        to stop sending it. Use {'{name}'} in the subject or body for the member's name.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-welcome-email-from-name">From name</Label>
          <Input
            id="settings-welcome-email-from-name"
            value={form.welcomeEmailFromName}
            placeholder={props.defaultFromName}
            onChange={(event) =>
              setForm((f) => ({ ...f, welcomeEmailFromName: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="settings-welcome-email-subject">Subject</Label>
          <Input
            id="settings-welcome-email-subject"
            value={form.welcomeEmailSubject}
            placeholder="Welcome, {name}!"
            onChange={(event) =>
              setForm((f) => ({ ...f, welcomeEmailSubject: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Body</Label>
          <FieldRichText
            input={{
              name: 'welcomeEmailContent',
              value: form.welcomeEmailContent,
              onChange: (content: JSONContent) =>
                setForm((f) => ({ ...f, welcomeEmailContent: content })),
              onBlur: () => {},
              onFocus: () => {},
            }}
            meta={{}}
            imageUploadHandler={uploadImage}
            placeholder="Thanks for joining..."
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
          <Button type="button" variant="outline" disabled={sendingTest} onClick={sendTest}>
            Send test email to me
          </Button>
        </div>
      </form>
    </div>
  );
}
