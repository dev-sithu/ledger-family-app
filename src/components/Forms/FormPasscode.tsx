import {FC, useContext, useEffect, useRef} from "react";
import {FormActionProps, FormUserValues, JSONValue, UserContextType, UserWithTokens} from "../../types/declarations";
import {Box, Button} from "@mui/material";
import Error from "../Error.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {FORM_ACTION} from "../../lib/constants.ts";
import {UserContext} from "../../contexts/userContext.tsx";
import {useLazyQuery} from "../../lib/hooks.ts";
import {apiErrorHandling} from "../../lib/api.ts";
import mQuery from "../../queries/mutations.ts";
import {getLoginUser, storeItemEncrypted} from "../../lib/utils.ts";
import config from "../../lib/config.ts";
import LoadingBackdrop from "../Loading/LoadingBackdrop.tsx";
import PasscodeInput from "../PasscodeInput.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../state/store.ts";

const FormPasscode: FC<FormActionProps> = ({ action }: FormActionProps) => {
  let {email} = useContext<UserContextType>(UserContext);
  const navigate = useNavigate();
  const {otp} = useSelector((state: RootState) => state.user);
  const {
    formState: {errors},
    setError,
    clearErrors,
    setValue,
    handleSubmit
  } = useForm<FormUserValues>();

  if (!email) {
    const user = getLoginUser();
    if (user) {
       email = user.email
    }
  }
  setValue('email', email);  // Set email value to react-hook-form

  useEffect(() => {
    if (!email) {
      navigate(`/${action}`);
    }
  }, [action, email, navigate]);

  const submitRef = useRef<() => void>(() => {});
  submitRef.current = () => handleSubmit(submitForm)();

  useEffect(() => {
    if (otp.length === 6) {
      submitRef.current();
    }
  }, [otp]);

  const query = useLazyQuery(
    async (formData: FormUserValues) => {
      let result: UserWithTokens;
      if (action == FORM_ACTION.REGISTER) {
        result = await mQuery.register(formData) as UserWithTokens;
        console.log(result);
      } else {
        result = await mQuery.login(formData) as UserWithTokens;
        storeItemEncrypted(config.userStoreKey, result.user as JSONValue)
      }
    },
    {
      onSuccess: () => {
        if (action == FORM_ACTION.REGISTER) {
          // after registration complete, redirect to login
          navigate(`/login`)
        } else {
          // after login complete, redirect to dashboard
          navigate(`/dashboard`)
        }
      },
      onError: err => apiErrorHandling(err, setError)
    }
  );

  const submitForm = async () => {
    const data: FormUserValues = {
      email,
      password: otp,
    }
    query.mutate(data);
  };

  return (
    <>
      <Box component="form" autoComplete="off">
        <h4>{email} <Link to={`/${action}`}>[Change]</Link></h4>
        <Error field={errors.email}/>

        <PasscodeInput
          action={action}
          setValue={setValue}
          clearErrors={clearErrors}
          errors={errors}
        />

        <div>
          <Button
            onClick={handleSubmit(submitForm)}
            disabled={otp.length < 6 || query.isPending}
            className="btn-orange"
            variant="contained"
            size="large"
            fullWidth
          >
            {action === FORM_ACTION.REGISTER ? 'Register' : 'Sign In'}
          </Button>
        </div>
      </Box>
      <Box sx={{my: 2}}>
        <Link to={`/${action}`}>Back</Link>
      </Box>
      <LoadingBackdrop open={query.isPending} />
    </>
  );
}

export default FormPasscode;


