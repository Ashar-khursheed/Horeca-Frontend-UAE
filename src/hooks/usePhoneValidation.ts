import { useEffect, useRef, useState } from "react";
import { makeApiRequest } from "@/apis/axios-instance";
import { apiUrls } from "@/apis/api-endpoint";

interface ValidateResponse {
  success: boolean;
  phone_details: {
    is_valid: boolean;
  };
}

export function usePhoneValidation(phone: string, countryCode: string) {
  const [validating, setValidating] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!phone) {
      setIsInvalid(false);
      setErrorMsg("");
      setValidating(false);
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (!countryCode) return;
      setValidating(true);
      try {
        const res = await makeApiRequest<ValidateResponse>(apiUrls.PHONE_VALIDATE, {
          method: "POST",
          data: { country_code: countryCode, phone },
        });
        const valid = res?.phone_details?.is_valid ?? true;
        setIsInvalid(!valid);
        setErrorMsg(!valid ? "Phone number is invalid" : "");
      } catch {
        setIsInvalid(false);
        setErrorMsg("");
      } finally {
        setValidating(false);
      }
    }, 800);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phone, countryCode]);

  return { validating, isInvalid, errorMsg };
}
