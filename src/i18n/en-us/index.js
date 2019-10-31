export default {
  common: {
    appName: 'Telos Communities',
    buttons: {
      cancel: 'Cancel',
      continue: 'Continue',
      create: 'Create',
      logout: 'Logout',
      register: 'Register'
    },
    defaultTitle: 'Title'
  },
  components: {
    notifications: {
      linkTip: 'Display on block explorer'
    }
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
  menu: {
    trails: 'Trails',
    trailsBallots: 'Ballots',
    trailsTreasuries: 'Treasuries'
  },
  notifications: {
    title: 'Transactions',
    trails: {
      castVote: 'Cast a vote',
      registerVoter: 'Register as a voter'
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
    trails: {
      ballots: {
        castVote: 'Cast vote',
        ends: 'Ends',
        starts: 'Starts'
      },
      treasuries: {
        card: {
          maxSupply: 'Max supply',
          openBallots: 'Open ballots',
          supply: 'Supply',
          registerVoter: 'Register as a voters'
        },
        registerVoterDialog: {
          title: 'Do you want to register to this treasury?'
        }
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
      title: 'Select your wallet',
      selectAccount: 'Please select an account'
    }
  }
}
