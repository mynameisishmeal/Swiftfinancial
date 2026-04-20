export const translations = {
  en: {
    welcome: 'Welcome',
    signIn: 'Sign In',
    email: 'Email or Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot username/password?',
    notEnrolled: 'Not Enrolled?',
    signUpNow: 'Sign Up Now',
    signingIn: 'Signing in...',
    personal: 'Personal',
    business: 'Business',
    investing: 'Investing',
    support: 'Support',
  },
  es: {
    welcome: 'Bienvenido',
    signIn: 'Iniciar Sesión',
    email: 'Correo o Usuario',
    password: 'Contraseña',
    rememberMe: 'Recuérdame',
    forgotPassword: '¿Olvidó usuario/contraseña?',
    notEnrolled: '¿No está inscrito?',
    signUpNow: 'Regístrese Ahora',
    signingIn: 'Iniciando sesión...',
    personal: 'Personal',
    business: 'Negocios',
    investing: 'Inversiones',
    support: 'Soporte',
  },
  fr: {
    welcome: 'Bienvenue',
    signIn: 'Se Connecter',
    email: 'Email ou Nom d\'utilisateur',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    notEnrolled: 'Pas encore inscrit?',
    signUpNow: 'S\'inscrire Maintenant',
    signingIn: 'Connexion...',
    personal: 'Personnel',
    business: 'Entreprise',
    investing: 'Investissement',
    support: 'Support',
  },
  de: {
    welcome: 'Willkommen',
    signIn: 'Anmelden',
    email: 'E-Mail oder Benutzername',
    password: 'Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    notEnrolled: 'Noch nicht registriert?',
    signUpNow: 'Jetzt Registrieren',
    signingIn: 'Anmeldung...',
    personal: 'Persönlich',
    business: 'Geschäft',
    investing: 'Investieren',
    support: 'Unterstützung',
  },
  zh: {
    welcome: '欢迎',
    signIn: '登录',
    email: '电子邮件或用户名',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记用户名/密码？',
    notEnrolled: '还没有注册？',
    signUpNow: '立即注册',
    signingIn: '登录中...',
    personal: '个人',
    business: '商业',
    investing: '投资',
    support: '支持',
  },
  ar: {
    welcome: 'مرحبا',
    signIn: 'تسجيل الدخول',
    email: 'البريد الإلكتروني أو اسم المستخدم',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    notEnrolled: 'غير مسجل؟',
    signUpNow: 'سجل الآن',
    signingIn: 'جاري تسجيل الدخول...',
    personal: 'شخصي',
    business: 'أعمال',
    investing: 'استثمار',
    support: 'الدعم',
  },
};

export type Language = keyof typeof translations;

export async function detectLanguageFromLocation(): Promise<Language> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;

    const languageMap: Record<string, Language> = {
      US: 'en', CA: 'en', GB: 'en', AU: 'en', NZ: 'en', IE: 'en',
      ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
      FR: 'fr', BE: 'fr', CH: 'fr', LU: 'fr',
      DE: 'de', AT: 'de',
      CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
      SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', KW: 'ar', QA: 'ar',
    };

    return languageMap[countryCode] || 'en';
  } catch (error) {
    return 'en';
  }
}

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de', 'zh', 'ar'];
  
  return supportedLanguages.includes(browserLang as Language) 
    ? (browserLang as Language) 
    : 'en';
}
