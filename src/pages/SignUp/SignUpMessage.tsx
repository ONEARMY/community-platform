import { HeroBanner, Icon, Stepper } from 'oa-components';
import { ORGANISATION_SIGNUP_STEPS } from 'src/pages/SignUp/constants';
import { Card, CardContent } from '@/components/ui/card';

const SignUpMessagePage = ({ email, isOrganisation = false }) => {
  return (
    <div className="mx-auto mt-10 mb-4 w-full max-w-[620px] px-2 md:mt-20">
      <HeroBanner type="email" />
      <div className="flex -translate-y-[50px] flex-col">
        <div className="z-[3] self-center rounded-[25px] border-2 border-black">
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
        <Card variant="outline" className="-translate-y-[25px]">
          <CardContent className="flex flex-col gap-2 pt-6">
            {isOrganisation && <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={1} />}
            <h1 className="text-center text-2xl font-semibold">Yay! Welcome to One Army!</h1>
            <p className="text-center text-muted-foreground">
              Before you dive in, please confirm you email through the link we've sent to{' '}
              <span className="bg-[linear-gradient(0deg,#ffe2e1_60%,#fff_40%)] px-1">{email}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpMessagePage;
