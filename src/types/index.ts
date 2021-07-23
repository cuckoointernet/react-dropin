import {
  BillingRequest,
  BillingRequestFlow,
} from "gocardless-nodejs";

// Re-export, for integrator convenience when loading these bindings.
export type { BillingRequest, BillingRequestFlow };

// GoCardlessDropin is the global interface around creating instances of the
// Dropin.
export interface GoCardlessDropin {
  create: (options: GoCardlessDropinOptions) => void;
}

// Options for creating a Dropin instance. We may broaden this eventually, and
// allow creating a Dropin from sources other than an existing BRF ID, such as
// when we support Billing Request Templates.
export type GoCardlessDropinOptions = ClientCallbacks & {
  // Billing Request Flow ID that has been created in the backend, intended to
  // be worked by the Dropin.
  billingRequestFlowID: string;
  // Environment name, one of live or sandbox.
  environment: string;
  // Domain override if using a custom environment (for internal use only).
  domain?: string;
};

export type GoCardlessDropinOnSuccess = (
  billingRequest: BillingRequest,
  billingRequestFlow: BillingRequestFlow
) => void;

export type GoCardlessDropinOnExit = (
  error: object | null,
  metadata: object
) => void;

export interface ClientCallbacks {
  // onSuccess receives the Billing Request that has been worked.
  //
  // This is called when the flow exits successfully. Depending on how the flow
  // was configured, it may have completed successfully but not fulfilled the
  // Billing Request- it is incumbent on the integrator to check the status of
  // the request before assuming it has been fulfilled.
  onSuccess: GoCardlessDropinOnSuccess;

  // onExit should take two arguments: an error object and a metadata object.
  //
  // The onExit callback is called when the customer left the flow before
  // completion. This can happen because either they have voluntarily abandoned
  // the flow, or because an unrecoverable error occurred.
  //
  // The error object is null if no error was encountered. At the time of
  // writing no additional object property is documented.
  //
  // The metadata object is always not null. At the time of writing no
  // additional object properties are documented.
  onExit: GoCardlessDropinOnExit;
}

// Extend window with the GoCardlessDropin type, so TypeScript consumers can use
// the client.
declare global {
  interface Window {
    GoCardlessDropin: GoCardlessDropin;
  }
}
