import { observer } from "mobx-react-lite";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedIcon } from "@/components/ThemedIcon";
import { z } from "zod";
import authStore from "@/store/auth.store";
import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";

const translations = {
  en: en,
  ru: ru,
};

const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.enableFallback = true;

const emailSchema = z.string().email({ message: `${i18n.t("error.email")}` });

const EmailValidationComponent = observer(() => {
  const handleEmailChange = (email: string) => {
    authStore.setEmail(email);
    try {
      emailSchema.parse(email);
      authStore.setEmailError("");
    } catch (e) {
      if (e instanceof z.ZodError) {
        authStore.setEmailError(e.errors[0].message);
      }
    }
  };

  return (
    <ThemedInput
      value={authStore.email.toLowerCase()}
      onChangeText={handleEmailChange}
      errorMessage={authStore.emailError}
      label={i18n.t("auth.email")}
      placeholder={i18n.t("auth.placeholder.email")}
      textContentType="emailAddress"
      leftIcon={<ThemedIcon name="email" size={20} />}
    />
  );
});

export default EmailValidationComponent;
