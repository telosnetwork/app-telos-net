export default {
  common: {
    appName: 'Telos Communities',
    buttons: {
      logout: 'Logout'
    },
    defaultTitle: 'Title'
  },
  forms: {
    errors: {
      accountFormat: 'The account must contain lowercase characters only and number from 1 to 5',
      accountLength: 'The account must contain 12 characters',
      accountNotAvailable: 'The account "{account}" already exists',
      accountNotExists: 'The account "{account}" does not exist',
      copyKey: 'Copy the key to a safe place',
      required: 'This field is required'
    }
  },
  pages: {
    accounts: {
      add: {
        buttons: {
          continue: 'Continue',
          goToProfile: 'Take me to my profile',
          verify: 'Verify phone number'
        },
        congratulationsTitle: 'Congratulations',
        congratulationsSubtitle: 'Your account {account} has been created',
        createAccountHint: 'A verification code will be sent',
        createAccountTitle: 'Create an Account',
        forms: {
          account: 'Account name',
          smsNumber: 'Phone number',
          verificationCode: 'Verification code'
        },
        title: 'Signup',
        verifyAccountGeneratingKey: 'Generating key pairs',
        verifyAccountHint: 'Copy both keys in a safe place before sending your verification code',
        verifyOTPTitle: 'Enter your verification code'
      }
    },
    index: {
      buttons: {
        createAccount: 'Create account',
        login: 'Login with Telos'
      }
    },
    login: {
      getApp: 'Download the app',
      title: 'Select your wallet'
    }
  }
}
