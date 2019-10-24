export default {
  components: {
    layout: {
      login: {
        button: 'Login',
        getApp: 'Download the app',
        title: 'Select your wallet'
      },
      logout: {
        button: 'Logout'
      }
    },
    index: {
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
    }
  }
}
