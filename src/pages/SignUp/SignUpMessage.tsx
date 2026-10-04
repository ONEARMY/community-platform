import { HeroBanner, Icon } from 'oa-components';
import { ORGANISATION_SIGNUP_STEPS } from 'src/pages/SignUp/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';

const SignUpMessagePage = ({ email, isOrganisation = false }) => {
  return (
    <div className="mx-auto mt-10 mb-4 w-full max-w-124 px-2 md:mt-20">
      <HeroBanner type="email" />
      <div className="flex -translate-y-10 flex-col">
        <div className="z-3 self-center rounded-3xl border-2 border-black">
          <Icon
            glyph="star-active"
            size={60}
            sx={{
              backgroundColor: '#ffedd6',
              border: '5px solid #fff',
              borderRadius: 25,
              padding: 2,
            }}
          />
        </div>
        <Card variant="outline" className="-translate-y-5">
          <CardContent gap="sm" className="mt-2 flex flex-col">
            {isOrganisation && <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={1} />}
            <h1 className="text-center text-2xl font-semibold">Yay! Welcome to One Army!</h1>
            <p className="text-center text-muted-foreground">
              Before you dive in, please confirm you email through the link we've sent to{' '}
              <span className="highlight-marker px-1">{email}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpMessagePage;
