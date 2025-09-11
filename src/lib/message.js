export const Messages = {
  action: {
    fetch: {
      success: (entity = "Data") => `${entity} loaded successfully.`,
      error: (entity = "data") =>
        `Could not load ${entity.toLowerCase()}. Please try again later.`,
    },
    create: {
      success: (entity = "Item") => `${entity} created successfully.`,
      error: (entity = "item") =>
        `Failed to create ${entity.toLowerCase()}. Please try again.`,
    },
    update: {
      success: (entity = "Item") => `${entity} updated successfully.`,
      error: (entity = "item") =>
        `Could not update ${entity.toLowerCase()}. Please try again later.`,
    },
    delete: {
      success: (entity = "Item") => `${entity} deleted successfully.`,
      error: (entity = "item") =>
        `Could not delete ${entity.toLowerCase()}. Please try again later.`,
      notFound: (entity = "Item") => `${entity} not found.`,
    },
  },

  otp: {
    send: {
      success: "OTP has been sent to your email.",
      error: "Failed to send OTP. Please try again.",
      providerError: "We couldn’t send the OTP email. Please try again later.",
    },
    verify: {
      success: "Your email has been verified successfully!",
      invalid: "Invalid OTP. Please check and try again.",
      expired: "OTP has expired. Please request a new one.",
      error: "An error occurred during OTP verification. Please try again.",
    },
  },
};
