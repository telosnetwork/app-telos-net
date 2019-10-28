export default {
  common: {
    appName: 'Telos Communities',
    buttons: {
      logout: 'Logout'
    },
    defaultTitle: 'Title',
    cancel: 'Cancel',
    continue: 'Continue'
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
          voters: 'Voters'
        }
      }
    },
    index: {
      buttons: {
        createAccount: 'Create account',
        login: 'Login with Telos'
      },
      router: {
        chat: 'Chat',
        signUp: 'Sign Up',
        chatList: 'Chat List',
        contactList: 'Contact List',
        registerApp: 'Register App',
        appList: 'App List'
      }
    },
    signUp: {
      form: {
        presentation: 'Presentation',
        firstName: 'First Name',
        lastName: 'Last Name',
        preferMethodComm: 'Prefer method of communication',
        sms: 'SMS Number',
        email: 'Email',
        currentSms: 'Current SMS Number',
        currentEmail: 'Current Email',
        country: 'Country',
        hobbies: 'Hobbies',
        btnSave: 'Save'
      }
    },
    general: {
      search: 'Search',
      name: 'Name',
      eosAccount: 'eosAccount',
      domain: 'Domain',
      defaultChatList: 'There are no chats yet',
      defaultMessageList: 'There are no messages yet',
      defaultContactList: 'There are no contacts yet',
      defaultAppList: 'There are no apps yet'
    },
    registerApp: {
      form: {
        urlBase: 'URL',
        name: 'Name',
        appId: 'AppId',
        shortName: 'Short Name',
        ownerAccount: 'Owner Account'
      }
    },
    login: {
      getApp: 'Download the app',
      title: 'Select your wallet',
      enterAccount: 'Please enter your account name'
    }
  }
}
