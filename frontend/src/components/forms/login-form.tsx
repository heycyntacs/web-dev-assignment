import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useLoginForm } from '@/hooks/form-hooks';
import { Controller } from 'react-hook-form';
import { Button } from '../ui/button';

export default function LoginForm() {
  const { form, onSubmit, loading, error } = useLoginForm();

  return (
    <form className="w-full max-w-md" onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          {error && (
            <Field>
              <FieldError errors={[{ message: error }]} />
            </Field>
          )}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  {...field}
                  disabled={loading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...field}
                  disabled={loading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
