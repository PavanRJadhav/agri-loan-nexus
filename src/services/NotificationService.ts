
// This is a mock email notification service that would be replaced with a real email service
// like SendGrid or a backend implementation in a production app

interface EmailNotification {
  to: string;
  subject: string;
  body: string;
}

export const sendEmailNotification = async (notification: EmailNotification): Promise<boolean> => {
  console.log(`EMAIL NOTIFICATION SENT:
    To: ${notification.to}
    Subject: ${notification.subject}
    Body: ${notification.body}
  `);
  
  // In a real app, this would use an API call to a backend service
  // For now, we'll simulate success and just log to the console
  return true;
};

export const getNotificationTemplates = () => {
  return {
    loanApplication: (userName: string, loanType: string, amount: number) => ({
      subject: `Loan Application Received - ${loanType}`,
      body: `Dear ${userName},\n\nYour loan application for ${loanType} (₹${amount.toLocaleString()}) has been received and is being processed. We will notify you of any updates.\n\nThank you for choosing AgriLoan.`
    }),
    loanApproved: (userName: string, loanType: string, amount: number) => ({
      subject: `Loan Application Approved - ${loanType}`,
      body: `Congratulations ${userName}!\n\nYour loan application for ${loanType} (₹${amount.toLocaleString()}) has been approved. The funds have been disbursed to your account.\n\nThank you for choosing AgriLoan.`
    }),
    loanRejected: (userName: string, loanType: string) => ({
      subject: `Loan Application Update - ${loanType}`,
      body: `Dear ${userName},\n\nWe regret to inform you that your loan application for ${loanType} has been rejected. For more information, please contact our support team.\n\nThank you for choosing AgriLoan.`
    }),
    lenderSelected: (userName: string, lenderName: string) => ({
      subject: `Lender Selection Confirmation - ${lenderName}`,
      body: `Dear ${userName},\n\nYou have selected ${lenderName} as your preferred lending partner. This selection will be applied to your future loan applications.\n\nThank you for choosing AgriLoan.`
    }),
    profileUpdated: (userName: string) => ({
      subject: `Profile Update Confirmation`,
      body: `Dear ${userName},\n\nYour profile information has been successfully updated. If you did not make these changes, please contact our support team immediately.\n\nThank you for choosing AgriLoan.`
    }),
  };
};
