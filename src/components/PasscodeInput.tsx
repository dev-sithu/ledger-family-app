import {FC, Fragment} from "react";
import {Box} from "@mui/material";
import {OTPInput, SlotProps, REGEXP_ONLY_DIGITS} from "input-otp";
import Error from "./Error.tsx";
import {Link} from "react-router-dom";
import {FORM_ACTION} from "../lib/constants.ts";
import {PasscodeInputProps} from "../types/declarations";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store.ts";
import {setOtp, togglePasscode} from "../state/slices/userSlice.ts";

const Slot = ({char, isActive, placeholderChar}: SlotProps) => (
  <span className={`otp-slot${isActive ? ' otp-slot--active' : ''}`}>
    {char ?? placeholderChar ?? ''}
  </span>
);

const PasscodeInput: FC<PasscodeInputProps> = ({ action, setValue, clearErrors, errors, focused }: PasscodeInputProps) => {
  const {visiblePasscode, otp} = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  if (typeof focused !== 'boolean') {
    focused = true;
  }

  const label = action === FORM_ACTION.REGISTER
    ? 'Enter a 6-digit passcode'
    : 'Enter your 6-digit passcode';

  const handleClickShowPassword = () => {
    dispatch(togglePasscode((!visiblePasscode)));
  };

  const handleChange = (otp: string) => {
    if (/^\d*$/.test(otp)) {
      dispatch(setOtp(otp));
      setValue("password", otp); // Set passcode value to react-hook-form
      clearErrors('password'); // Clear errors when passcode changes
    }
  };

  return (
    <>
      <Box>
        { action && <Box sx={{py: 2}}>{label}</Box> }
        <OTPInput
          maxLength={6}
          type={visiblePasscode ? 'text' : 'password'}
          value={otp}
          onChange={handleChange}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoFocus={focused}
          containerClassName="passcode-input"
          render={({slots}) => (
            <>
              {slots.map((slot, index) => (
                <Fragment key={index}>
                  {index > 0 && <span className="otp-separator">&nbsp;</span>}
                  <Slot {...slot} />
                </Fragment>
              ))}
            </>
          )}
        />
        <Error field={errors.password}/>
      </Box>
      <Box sx={{my: 2, textAlign: 'center'}}>
        <Link to='#' onClick={handleClickShowPassword}>{visiblePasscode ? 'Hide' : 'Show'} Passcode</Link>
      </Box>
    </>
  );
}

export default PasscodeInput;