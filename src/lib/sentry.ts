import * as Sentry from "@sentry/react";

export function initSentry() {
  Sentry.init({
    dsn: "https://858354e88068df822892f3b917eda6eb@o4510251609292800.ingest.us.sentry.io/4510251611258880",

    environment: import.meta.env.MODE || "production",

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],

    tracesSampleRate: 1.0,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    sendDefaultPii: true,

    beforeSend(event) {
      if (import.meta.env.DEV) {
        console.log("Sentry event (dev):", event);
        return null;
      }
      return event;
    },
  });
}
