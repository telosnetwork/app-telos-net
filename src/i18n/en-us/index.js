export default {
  common: {
    appName: 'Telos Communities',
    buttons: {
      cancel: 'Cancel',
      continue: 'Continue',
      create: 'Create',
      logout: 'Logout',
      register: 'Register',
      save: 'Save'
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
    },
    hints: {
      selectCountrie: 'Please select your country',
      pressToAddHobbie: 'Press enter to add a hobby'
    }
  },
  menu: {
    trails: 'Voting',
    trailsBallots: 'Ballots',
    trailsTreasuries: 'Groups',
    profiles: 'Profiles',
    contacts: 'Contacts',
    myProfile: 'My profile',
    chats: 'Chats',
    registerApp: 'Register App',
    appList: 'Apps'
  },
  notifications: {
    title: 'Transactions',
    trails: {
      addBallot: 'Create a ballot',
      addTreasury: 'Create a group',
      castVote: 'Cast a vote',
      registerVoter: 'Register as a voter'
    },
    poc: {
      lockSafe: 'Lock safe',
      unlockSafe: 'Unlock safe'
    }
  },
  lists: {
    empty: {
      countries: 'No countries'
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
        verifyAccountHint: 'Copy both keys to a safe place before sending your verification code',
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
          openedBallots: 'Opened ballots',
          supply: 'Supply',
          registerVoter: 'Register as a voter'
        },
        registerVoterDialog: {
          title: 'Do you want to register to this group?'
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
        presentation: 'Salutation (Mr./Mrs.)',
        firstName: 'First Name',
        lastName: 'Last Name',
        preferMethodComm: 'Preferred method of communication',
        sms: 'SMS Number',
        email: 'Email',
        currentSms: 'Current SMS Number',
        currentEmail: 'Current Email',
        country: 'Country',
        hobbies: 'Hobbies',
        btnSave: 'Save',
        newCustomFieldName: 'Write the name of new custom field',
        editCustomFieldName: 'Write the new field name',
        addCustomField: 'Add custom field'
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
      defaultAppList: 'There are no apps yet',
      noAccountsFound: 'No accounts found'
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
      selectAccount: 'Please select an account'
    },
    testnetRotation: {
      title: 'Add your testnet BP to the schedule'
    },
    testnetDevelopers: {
      title: 'Get a testnet account or testnet TLOS'
    },
    poc: {
      smartsafe: {
        title: 'SmartSafe POC',
        last_unlocker: 'Last unlocked by',
        last_unlock_time: 'Last unlocked',
        lock: 'Lock',
        unlock: 'Unlock',
        locked_by: 'Locked by',
        lock_time: 'Locked at'
      }
    },
    verifyProfile: {
      verifySMS: 'Verify SMS',
      codeSMS: 'Verification code',
      verifyEMAIL: 'Verify EMAIL',
      codeEMAIL: 'Verification code'
    },
    profileLogin: {
      failed: 'Unable to login to the profile service'
    }
  }
}
